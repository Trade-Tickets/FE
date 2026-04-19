
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PLATFORM_FEE_RATE, SELL_TAX_RATE } from '../types';

const PLATFORM_ADDRESS = '0x6300b89eb6922d169bf4f632e08de41b63905b3c5e3ccca06ee2a441768400cf';

const APP_NETWORK = (import.meta.env.VITE_SUI_NETWORK || 'testnet').toLowerCase();
const CHAIN = APP_NETWORK === 'mainnet' ? 'sui:mainnet' : 'sui:testnet';

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

  const executeBuyOnChain = async (
    walletAddress: string,
    priceSui: number,
    quantity: number
  ): Promise<TradeResult> => {
    if (!walletAddress) {
      throw new Error('Wallet not connected');
    }

    const orderValue = priceSui * quantity;
    const platformFee = orderValue * PLATFORM_FEE_RATE;
    const totalCost = orderValue + platformFee;

    const totalMist = BigInt(Math.round(totalCost * 1_000_000_000));

    const tx = new Transaction();

    const [coin] = tx.splitCoins(tx.gas, [totalMist]);
    tx.transferObjects([coin], PLATFORM_ADDRESS);
    tx.setGasBudget(10_000_000);

    const result = await signAndExecute({
      transaction: tx,
      chain: CHAIN,
    });

    await client.waitForTransaction({ digest: result.digest });

    return {
      txDigest: result.digest,
      amountSpent: totalCost,
      platformFee,
      sellTax: 0,
      netAmount: totalCost,
    };
  };

  const executeSellOnChain = async (
    walletAddress: string,
    priceSui: number,
    quantity: number
  ): Promise<TradeResult> => {
    if (!walletAddress) {
      throw new Error('Wallet not connected');
    }

    const orderValue = priceSui * quantity;
    const platformFee = orderValue * PLATFORM_FEE_RATE;
    const sellTax = orderValue * SELL_TAX_RATE;
    const totalFees = platformFee + sellTax;
    const netProceeds = orderValue - totalFees;

    const feesMist = BigInt(Math.round(totalFees * 1_000_000_000));

    const tx = new Transaction();
    const [feeCoin] = tx.splitCoins(tx.gas, [feesMist]);
    tx.transferObjects([feeCoin], PLATFORM_ADDRESS);
    tx.setGasBudget(10_000_000);

    const result = await signAndExecute({
      transaction: tx,
      chain: CHAIN,
    });

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
