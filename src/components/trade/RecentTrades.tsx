import { useEffect, useRef } from 'react';
import type { TradeTick } from '../../hooks/useTradeSimulator';

interface RecentTradesProps {
  trades: TradeTick[];
}

export function RecentTrades({ trades }: RecentTradesProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when new trades arrive (newest on top)
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [trades.length]);

  return (
    <div className="w-[45%] flex flex-col bg-white overflow-hidden">
      <div className="bg-brand-blue text-white p-2 text-center uppercase tracking-widest text-[10px] font-black border-b-[3px] border-black shadow-[0_2px_0_#000] z-10 relative">
        Recent Trades (Khớp lệnh)
      </div>
      <div className="flex bg-gray-200 border-b-[2px] border-black py-1 px-4 text-[10px] text-gray-500 uppercase z-10 relative">
        <span className="w-[30%] text-left">Time</span>
        <span className="w-[35%] text-center">Price</span>
        <span className="w-[20%] text-right">Vol</span>
        <span className="w-[15%] text-right">M/B</span>
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-2 gap-[2px] bg-white">
        {trades.map((trade, i) => {
        // Vietnamese convention: M = Mua (Buy) = green, B = Bán (Sell) = red
          const isMua = trade.side === 'M';
          const isNew = i === 0;
          return (
            <div
              key={trade.id}
              className={`flex px-2 py-1.5 border-b-[1px] border-gray-100 hover:bg-gray-100 items-center transition-colors duration-300 ${isMua ? 'bg-green-50/50' : 'bg-red-50/50'} ${isNew ? 'animate-pulse-once' : ''}`}
            >
              <span className="w-[30%] text-left text-gray-500 font-medium tracking-tighter text-[10px]">
                {trade.time}
              </span>
              <span className={`w-[35%] text-center font-black text-[10px] ${isMua ? 'text-green-600' : 'text-red-500'}`}>
                {trade.price.toFixed(4)}
                {trade.priceChange !== 0 && (
                  <span className={`ml-1 text-[8px] ${trade.priceChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.priceChange > 0 ? '▲' : '▼'}
                  </span>
                )}
              </span>
              <span className="w-[20%] text-right text-black font-bold text-[10px]">
                {trade.volume.toLocaleString()}
              </span>
              <span className={`w-[15%] text-right font-black text-[10px] ${isMua ? 'text-green-600' : 'text-red-500'}`}>
                {trade.side}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
