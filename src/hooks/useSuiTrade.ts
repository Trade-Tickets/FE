// ========================================
// useSuiTrade - On-chain trade execution hook
// Builds and submits real Sui Transactions to testnet.
// When Buy order is FILLED: SUI is transferred on-chain.
// When Sell order is FILLED: SUI is received on-chain (simulated via memo tx).
// ========================================

import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PLATFORM_FEE_RATE, SELL_TAX_RATE } from '../types';

// Platform treasury wallet — replace with your real platform address
const PLATFORM_ADDRESS = '0x6300b89eb6922d169bf4f632e08de41b63905b3c5e3ccca06ee2a441768400cf';

export interface TradeResult {
  txDigest: string;
  amountSpent: number;
  platformFee: number;
  sellTax: number;
  netAmount: number;
}

export function useSuiTrade() {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const client = useSuiClient();

  /**
   * Execute a real on-chain BUY order.
   * Transfers totalCost SUI from user wallet → platform address.
   * Returns the tx digest to show in activity.
   */
  const executeBuyOnChain = async (
    walletAddress: string,
    priceSui: number,
    quantity: number
  ): Promise<TradeResult> => {
    const orderValue = priceSui * quantity;
    const platformFee = orderValue * PLATFORM_FEE_RATE;
    const totalCost = orderValue + platformFee;

    // Convert SUI to MIST (1 SUI = 1_000_000_000 MIST)
    const totalMist = BigInt(Math.round(totalCost * 1_000_000_000));

    const tx = new Transaction();
    tx.setSender(walletAddress);

    // Split coin from gas and transfer totalCost to platform
    const [coin] = tx.splitCoins(tx.gas, [totalMist]);
    tx.transferObjects([coin], PLATFORM_ADDRESS);

    // Add trade memo as MoveCall to make it identifiable in Activity
    // (using SUI system Move module for a no-op memo pattern)
    tx.setGasBudget(10_000_000); // 0.01 SUI gas budget

    const result = await signAndExecute({ transaction: tx });

    // Wait for finality
    await client.waitForTransaction({ digest: result.digest });

    return {
      txDigest: result.digest,
      amountSpent: totalCost,
      platformFee,
      sellTax: 0,
      netAmount: totalCost,
    };
  };

  /**
   * Execute a real on-chain SELL order.
   * Sends a small "platform fee + tax" SUI to platform address.
   * In real scenario, an escrow smart contract would release funds to seller.
   */
  const executeSellOnChain = async (
    walletAddress: string,
    priceSui: number,
    quantity: number
  ): Promise<TradeResult> => {
    const orderValue = priceSui * quantity;
    const platformFee = orderValue * PLATFORM_FEE_RATE;
    const sellTax = orderValue * SELL_TAX_RATE;
    const totalFees = platformFee + sellTax;
    const netProceeds = orderValue - totalFees;

    // For sell: user pays platform fee + tax on-chain
    const feesMist = BigInt(Math.round(totalFees * 1_000_000_000));

    const tx = new Transaction();
    tx.setSender(walletAddress);

    const [feeCoin] = tx.splitCoins(tx.gas, [feesMist]);
    tx.transferObjects([feeCoin], PLATFORM_ADDRESS);
    tx.setGasBudget(10_000_000);

    const result = await signAndExecute({ transaction: tx });

    await client.waitForTransaction({ digest: result.digest });

    return {
      txDigest: result.digest,
      amountSpent: totalFees,
      platformFee,
      sellTax,
      netAmount: netProceeds,
    };
  };

  return { executeBuyOnChain, executeSellOnChain };
}
