import { useState } from 'react';
import { PLATFORM_FEE_RATE, SELL_TAX_RATE } from '../../types';

interface TradeFormProps {
  isWalletConnected: boolean;
  activeTab: 'buy' | 'sell';
  setActiveTab: (tab: 'buy' | 'sell') => void;
  onExecuteTrade: (qty: number, price: number) => Promise<void>;
  defaultPrice: number;
  suiBalance?: string; // real SUI balance from wallet
}

export function TradeForm({ isWalletConnected, activeTab, setActiveTab, onExecuteTrade, defaultPrice, suiBalance }: TradeFormProps) {
  const [orderQty, setOrderQty] = useState(1);
  const [orderPrice, setOrderPrice] = useState(defaultPrice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderValue = orderQty * orderPrice;
  const platformFee = orderValue * PLATFORM_FEE_RATE;
  const sellTax = activeTab === 'sell' ? orderValue * SELL_TAX_RATE : 0;
  const totalCost = activeTab === 'buy' 
    ? orderValue + platformFee               // buyer pays more
    : orderValue - platformFee - sellTax;     // seller receives less

  const balanceNum = parseFloat(suiBalance || '0');
  // Only block buy if insufficient. Sell always fills regardless of balance.
  const insufficientFunds = activeTab === 'buy' && totalCost > balanceNum && balanceNum > 0;

  const handleSubmit = async () => {
    if (!isWalletConnected) return;
    setIsSubmitting(true);
    await onExecuteTrade(orderQty, orderPrice);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full lg:w-1/3 flex flex-col bg-white overflow-hidden relative">
      {/* Tabs */}
      <div className="flex border-b-[4px] border-black shrink-0 relative z-10">
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-4 font-black uppercase text-xl transition-colors border-r-[4px] border-black ${activeTab === 'buy' ? 'bg-brand-green text-black' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
        >
          Buy
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`flex-1 py-4 font-black uppercase text-xl transition-colors ${activeTab === 'sell' ? 'bg-[#ff5f56] text-white' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
        >
          Sell
        </button>
      </div>

      {/* Order Form */}
      <div className="flex-1 overflow-y-auto p-6 bg-brand-bg relative custom-scrollbar flex flex-col gap-6">
        <div className="flex justify-between items-center bg-white border-[3px] border-black p-3 shadow-[4px_4px_0px_#000]">
          <span className="font-bold text-gray-500 uppercase text-xs tracking-widest">Available Balance</span>
          <span className={`font-mono font-black ${insufficientFunds ? 'text-red-500' : ''}`}>
            {isWalletConnected ? `${suiBalance || '0.00'} SUI` : '0.0 SUI'}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {/* Quantity */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm uppercase tracking-widest text-gray-600">Quantity (Tickets)</label>
            <div className="flex bg-white border-[3px] border-black h-12 shadow-[4px_4px_0px_#000]">
              <button onClick={() => setOrderQty(Math.max(1, orderQty - 1))} className="w-12 border-r-[3px] border-black font-black text-xl hover:bg-gray-200 active:bg-gray-300">-</button>
              <input type="number" value={orderQty} onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))} className="flex-1 text-center font-mono font-black text-xl outline-none min-w-0" />
              <button onClick={() => setOrderQty(orderQty + 1)} className="w-12 border-l-[3px] border-black font-black text-xl hover:bg-gray-200 active:bg-gray-300">+</button>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm uppercase tracking-widest text-gray-600">Limit Price (SUI)</label>
            <div className="flex bg-white border-[3px] border-black h-12 shadow-[4px_4px_0px_#000]">
              <button onClick={() => setOrderPrice(Number(Math.max(0.01, orderPrice - 0.01).toFixed(4)))} className="w-12 border-r-[3px] border-black font-black text-xl hover:bg-gray-200 active:bg-gray-300">-</button>
              <input type="number" step="0.01" value={orderPrice} onChange={(e) => setOrderPrice(Math.max(0, parseFloat(e.target.value) || 0))} className="flex-1 text-center font-mono font-black text-xl outline-none min-w-0" />
              <button onClick={() => setOrderPrice(Number((orderPrice + 0.01).toFixed(4)))} className="w-12 border-l-[3px] border-black font-black text-xl hover:bg-gray-200 active:bg-gray-300">+</button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex flex-col gap-2 border-t-[4px] border-black border-dashed pt-4 mt-auto">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-gray-500 uppercase tracking-widest">Order Value</span>
            <span className="font-mono text-lg">{orderValue.toFixed(2)} SUI</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-gray-500 uppercase tracking-widest">Platform Fee (0.1%)</span>
            <span className="font-mono text-gray-500">{platformFee.toFixed(4)} SUI</span>
          </div>
          {activeTab === 'sell' && (
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-500 uppercase tracking-widest">Sell Tax (0.5%)</span>
              <span className="font-mono text-gray-500">{sellTax.toFixed(4)} SUI</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm font-black border-t-[2px] border-black pt-2 mt-1">
            <span className="uppercase tracking-widest">
              {activeTab === 'buy' ? 'Total Cost' : 'You Receive'}
            </span>
            <span className={`font-mono text-lg ${activeTab === 'buy' ? 'text-red-600' : 'text-green-600'}`}>
              {totalCost.toFixed(4)} SUI
            </span>
          </div>
          {insufficientFunds && (
            <p className="text-red-500 text-xs font-black uppercase mt-1 text-center animate-pulse">
              ⚠️ Insufficient SUI balance
            </p>
          )}
          {activeTab === 'sell' && (
            <p className="text-xs font-black text-green-600 uppercase mt-1 text-center">
              ✅ Sell fills instantly at any price
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="p-6 border-t-[4px] border-black bg-white shrink-0 z-20">
        <button
          disabled={!isWalletConnected || isSubmitting || insufficientFunds}
          onClick={handleSubmit}
          className={`w-full py-4 text-white border-[4px] border-black text-xl font-black uppercase tracking-widest shadow-[8px_8px_0px_#000] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group active:translate-x-2 active:translate-y-2 active:shadow-none ${
            activeTab === 'buy' ? 'bg-brand-green hover:bg-green-600 text-black' : 'bg-[#ff5f56] hover:bg-red-600 text-white'
          }`}
        >
          {!isWalletConnected ? 'Connect to Trade' : isSubmitting ? 'Processing...' : insufficientFunds ? 'Insufficient Balance' : (activeTab === 'buy' ? 'Place Buy Order' : 'Place Sell Order')}
        </button>
        {isSubmitting && (
          <p className="text-center font-bold text-xs uppercase text-gray-500 mt-3 animate-pulse">Confirming transaction on SUI network...</p>
        )}
      </div>
    </div>
  );
}
