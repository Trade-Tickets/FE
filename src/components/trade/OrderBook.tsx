import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Order, MarketStat } from '../../types';

interface OrderBookProps {
  eventId: string;
  selectedClass: string;
  currentStat: MarketStat | undefined;
  orders: Order[];
  isProfit: boolean;
}

export function OrderBook({ eventId, selectedClass, currentStat, orders, isProfit }: OrderBookProps) {
  const basePrice = currentStat?.floorPrice || 50;
  const openOrders = orders.filter(o => o.eventId === eventId && o.ticketClass === selectedClass && o.status === 'open');
  const userBids = openOrders.filter(o => o.type === 'buy');
  const userAsks = openOrders.filter(o => o.type === 'sell');

  const bidsMap = new Map<number, { vol: number; isUser: boolean }>();
  for (let i = 0; i < 15; i++) {
    const p = parseFloat((basePrice - (i * 0.2)).toFixed(2));
    if (p >= 0) bidsMap.set(p, { vol: Math.floor(Math.random() * 50 + 1) * 100, isUser: false });
  }
  userBids.forEach(ub => {
    const p = parseFloat(ub.priceSui.toFixed(2));
    const existing = bidsMap.get(p);
    if (existing) { existing.vol += ub.quantity; existing.isUser = true; }
    else bidsMap.set(p, { vol: ub.quantity, isUser: true });
  });
  const finalBids = Array.from(bidsMap.entries()).map(([price, data]) => ({ price, ...data })).sort((a, b) => b.price - a.price);

  const asksMap = new Map<number, { vol: number; isUser: boolean }>();
  for (let i = 0; i < 15; i++) {
    const p = parseFloat((basePrice + (i * 0.2) + 0.1).toFixed(2));
    asksMap.set(p, { vol: Math.floor(Math.random() * 50 + 1) * 100, isUser: false });
  }
  userAsks.forEach(ua => {
    const p = parseFloat(ua.priceSui.toFixed(2));
    const existing = asksMap.get(p);
    if (existing) { existing.vol += ua.quantity; existing.isUser = true; }
    else asksMap.set(p, { vol: ua.quantity, isUser: true });
  });
  const finalAsks = Array.from(asksMap.entries()).map(([price, data]) => ({ price, ...data })).sort((a, b) => a.price - b.price);

  const displayRows = Math.max(12, Math.min(25, Math.max(finalBids.length, finalAsks.length)));

  return (
    <div className="w-[55%] flex flex-col border-r-[4px] border-black bg-white overflow-hidden">
      <div className="bg-brand-purple text-white p-2 text-center uppercase tracking-widest text-[10px] font-black border-b-[3px] border-black shadow-[0_2px_0_#000] z-10 relative">
        Order Book
      </div>
      <div className="flex bg-gray-200 border-b-[2px] border-black py-1 px-4 text-[10px] text-gray-500 uppercase z-10 relative">
        <span className="w-[25%] text-left">Vol</span>
        <span className="w-[25%] text-center text-green-700 font-black">Bid</span>
        <span className="w-[25%] text-center text-red-700 font-black">Ask</span>
        <span className="w-[25%] text-right">Vol</span>
      </div>

            <div className="text-center font-black text-lg py-2 flex items-center justify-between px-4 bg-brand-bg border-b-[2px] border-black shadow-[0_2px_0_rgba(0,0,0,0.1)] truncate">
        <span className="text-xs uppercase text-gray-500 font-bold tracking-widest">Mark Price</span>
        <div className="flex items-center gap-2">
          {basePrice.toFixed(2)} SUI
          {isProfit ? <TrendingUp size={16} strokeWidth={3} className="text-green-600" /> : <TrendingDown size={16} strokeWidth={3} className="text-red-600" />}
        </div>
      </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-2 gap-[2px] bg-white">
        {Array.from({ length: displayRows }).map((_, i) => {
          const bid = finalBids[i];
          const ask = finalAsks[i];
          return (
            <div key={i} className="flex relative items-center py-[2px] hover:bg-gray-50 border-b-[1px] border-dashed border-gray-100">
              {bid && <div className="absolute right-[50%] top-0 bottom-0 bg-brand-green/20" style={{ width: `${Math.min(50, (bid.vol / 5000) * 50)}%` }}></div>}
              {ask && <div className="absolute left-[50%] top-0 bottom-0 bg-[#ff5f56]/10" style={{ width: `${Math.min(50, (ask.vol / 5000) * 50)}%` }}></div>}

              <span className={`w-[25%] text-left z-10 ${bid?.isUser ? 'text-brand-purple font-black' : 'text-black'}`}>{bid ? bid.vol : '-'}</span>
              <span className="w-[25%] text-center z-10 text-green-600 font-black relative">
                {bid ? bid.price.toFixed(2) : '-'}
                {bid?.isUser && <span className="absolute -left-1 text-[8px] top-1">👤</span>}
              </span>
              <span className="w-[25%] text-center z-10 text-red-500 font-black relative">
                {ask ? ask.price.toFixed(2) : '-'}
                {ask?.isUser && <span className="absolute -right-3 text-[8px] top-1">👤</span>}
              </span>
              <span className={`w-[25%] text-right z-10 ${ask?.isUser ? 'text-brand-purple font-black' : 'text-black'}`}>{ask ? ask.vol : '-'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
