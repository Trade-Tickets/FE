import type { MarketStat } from '../../types';

interface RecentTradesProps {
  currentStat: MarketStat | undefined;
}

export function RecentTrades({ currentStat }: RecentTradesProps) {
  const basePrice = currentStat?.floorPrice || 50;

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
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-2 gap-[2px] bg-white">
        {Array.from({ length: 25 }).map((_, i) => {
          const isBuy = Math.random() > 0.5;
          const price = (basePrice + (Math.random() * 2 - 1)).toFixed(2);
          return (
            <div key={i} className={`flex px-2 py-1.5 border-b-[1px] border-gray-100 hover:bg-gray-100 items-center ${isBuy ? 'bg-green-50/50' : 'bg-red-50/50'}`}>
              <span className="w-[30%] text-left text-gray-500 font-medium tracking-tighter">
                {new Date(Date.now() - Math.floor(Math.random() * i * 300000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className={`w-[35%] text-center font-black ${isBuy ? 'text-green-600' : 'text-red-500'}`}>
                {price}
              </span>
              <span className="w-[20%] text-right text-black font-bold">
                {Math.floor(Math.random() * 10 + 1)}00
              </span>
              <span className={`w-[15%] text-right font-black ${isBuy ? 'text-green-600' : 'text-red-500'}`}>
                {isBuy ? 'M' : 'B'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
