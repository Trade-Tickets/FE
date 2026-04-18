import { Clock } from 'lucide-react';

export function ProfileTradeHistory() {
  return (
    <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] p-6">
      <div className="flex items-center gap-2 font-black uppercase text-xl mb-6 flex-wrap">
        <Clock size={24} /> Recent Trade History
      </div>
      
      <div className="border-[3px] border-black overflow-hidden relative">
        <div className="flex bg-gray-200 border-b-[2px] border-black p-3 text-xs font-black text-gray-500 uppercase tracking-widest">
          <div className="flex-1">Event</div>
          <div className="w-24 text-center">Type</div>
          <div className="w-24 text-right">Price</div>
        </div>
        <div className="divide-y-[2px] divide-gray-100 flex flex-col">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex p-4 hover:bg-gray-50 items-center justify-between">
              <div className="flex-1 font-bold text-sm">Crypto Rally EOY</div>
              <div className="w-24 text-center">
                <span className="bg-[#ccfbf1] text-[#0f766e] px-2 py-0.5 border-[2px] border-black font-black text-[10px] uppercase">
                  Buy
                </span>
              </div>
              <div className="w-24 text-right font-mono font-bold">{(Math.random() * 5).toFixed(2)} SUI</div>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-[2px]">
          <span className="bg-black text-white font-black px-4 py-2 border-[2px] border-black shadow-[4px_4px_0px_#f8bb46] rotate-[-2deg]">
            COMING SOON
          </span>
        </div>
      </div>
    </div>
  );
}
