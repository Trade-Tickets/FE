import { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import type { Event } from '../types';
import { fetchEvents } from '../api/mockApi';
import { QrCode, ArrowRightLeft, TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function Dashboard() {
  const { userOwnedTickets, orders, cancelOrder } = useAppStore();
  const visibleOrders = orders.filter(o => o.status !== 'expired');
  const [activeTab, setActiveTab] = useState<'vault' | 'orders' | 'analytics'>('vault');
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  const getEventForTicket = (eventId: string) => events.find(e => e.id === eventId);

  // Aggregate tickets by eventId and ticketClass
  const groupedVault = userOwnedTickets.reduce((acc, ticket) => {
    const key = `${ticket.eventId}-${ticket.ticketClass}`;
    if (!acc[key]) {
      acc[key] = {
        eventId: ticket.eventId,
        ticketClass: ticket.ticketClass,
        count: 0,
        totalSpend: 0,
        tickets: []
      };
    }
    acc[key].count += 1;
    acc[key].totalSpend += ticket.priceSui;
    acc[key].tickets.push(ticket);
    return acc;
  }, {} as Record<string, { eventId: string, ticketClass: string, count: number, totalSpend: number, tickets: typeof userOwnedTickets }>);

  const aggregatedTickets = Object.values(groupedVault);

  // Account Overview Calc
  const totalInvested = aggregatedTickets.reduce((acc, g) => acc + g.totalSpend, 0);
  const currentEstValue = aggregatedTickets.reduce((acc, g) => {
    const event = getEventForTicket(g.eventId);
    const marketStat = event?.marketStats.find(s => s.ticketClass === g.ticketClass);
    return acc + ((marketStat?.floorPrice ?? (g.totalSpend / g.count)) * g.count);
  }, 0);
  const totalUnrealizedPnL = currentEstValue - totalInvested;
  const isTotalProfit = totalUnrealizedPnL >= 0;

  return (
    <div className="pt-8 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-8 min-h-[80vh]">
      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
         <div className="bg-brand-purple p-6 border-[4px] border-black shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-transform">
            <p className="font-black uppercase tracking-widest text-sm mb-2">Total Est. Value</p>
            <h2 className="text-4xl font-black">{currentEstValue.toFixed(2)} SUI</h2>
         </div>
         <div className="bg-brand-blue p-6 border-[4px] border-black shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-transform">
            <p className="font-black uppercase tracking-widest text-sm mb-2">Total Invested (Cost)</p>
            <h2 className="text-4xl font-black">{totalInvested.toFixed(2)} SUI</h2>
         </div>
         <div className={`p-6 border-[4px] border-black shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-transform ${isTotalProfit ? 'bg-brand-green' : 'bg-[#ff5f56] text-white'}`}>
            <p className="font-black uppercase tracking-widest text-sm mb-2">Unrealized PnL</p>
            <div className="flex items-center gap-2">
               <h2 className="text-4xl font-black">{isTotalProfit ? '+' : ''}{totalUnrealizedPnL.toFixed(2)} SUI</h2>
               {isTotalProfit ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
            </div>
         </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-[4px] border-black pb-6">
        <div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mix-blend-hard-light mb-2">
            Dashboard
          </h1>
          <p className="font-bold text-xl text-gray-600 bg-brand-yellow inline-block px-3 py-1 border-[2px] border-black shadow-[2px_2px_0px_#000]">
            Asset Portfolio & Trade History
          </p>
        </div>
        
        <div className="flex bg-white border-[4px] border-black shadow-[6px_6px_0px_#000] overflow-hidden">
          <button 
            onClick={() => setActiveTab('vault')}
            className={`px-6 py-4 font-black uppercase tracking-widest transition-colors ${activeTab === 'vault' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
          >
            My Vault
          </button>
          <div className="w-[4px] bg-black"></div>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-4 font-black uppercase tracking-widest transition-colors ${activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
          >
             Orders
          </button>
          <div className="w-[4px] bg-black"></div>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-4 font-black uppercase tracking-widest transition-colors ${activeTab === 'analytics' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
          >
             Trade PnL
          </button>
        </div>
      </div>

      {activeTab === 'vault' && (
        <div>
          {aggregatedTickets.length === 0 ? (
            <div className="w-full py-32 flex flex-col items-center justify-center bg-white border-[4px] border-black border-dashed opacity-80 shadow-[12px_12px_0px_#000] mb-8">
              <span className="text-8xl mb-6">🪹</span>
              <h3 className="text-3xl font-black uppercase tracking-tighter">Vault Empty</h3>
              <p className="font-bold text-gray-500 mt-2">You haven't executed any trades yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aggregatedTickets.map((group, idx) => {
                const event = getEventForTicket(group.eventId);
                const isTradingLive = event?.tradingStatus === 'Live';
                
                const avgEntryPrice = group.totalSpend / group.count;
                const marketStat = event?.marketStats.find(s => s.ticketClass === group.ticketClass);
                const currentFloor = marketStat?.floorPrice ?? avgEntryPrice;
                
                const pnl = currentFloor - avgEntryPrice;
                const pnlPercent = (pnl / avgEntryPrice) * 100;
                const isProfit = pnl >= 0;

                return (
                  <div key={`${group.eventId}-${group.ticketClass}-${idx}`} className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] flex flex-col relative group transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_#000]">
                    <div className="bg-brand-blue p-4 border-b-[4px] border-black flex justify-between items-center text-white">
                        <span className="font-black uppercase tracking-widest text-stroke-white" style={{ WebkitTextStroke: '1px black', textShadow: '2px 2px 0 #000'}}>{group.ticketClass}</span>
                        <div className="flex gap-2 items-center text-sm font-black bg-black px-2 py-1 border-[2px] border-white shadow-[2px_2px_0px_#fff]">
                          x{group.count}
                        </div>
                    </div>
                    
                    <div className="p-6 flex flex-col gap-4">
                        <div>
                          <p className="text-xs uppercase font-extrabold text-gray-500">Asset</p>
                          <h4 className="text-2xl font-black uppercase leading-tight line-clamp-2">{event?.title}</h4>
                        </div>
                        
                        <div className="flex flex-col gap-2 border-t-[3px] border-black border-dashed pt-4 mt-2">
                          <div className="flex justify-between items-end">
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Avg. Entry Price</p>
                                <p className="font-mono font-bold tracking-widest text-lg">{avgEntryPrice.toFixed(2)} SUI</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Total Holdings</p>
                                <p className="font-mono font-black">{group.totalSpend.toFixed(2)} SUI</p>
                              </div>
                          </div>

                          {isTradingLive && (
                              <div className={`mt-2 flex justify-between items-center px-3 py-2 border-[2px] border-black font-bold ${isProfit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                <span className="text-xs uppercase tracking-widest">Mark: {currentFloor} SUI</span>
                                <div className="flex items-center gap-1">
                                    {isProfit ? <TrendingUp size={16} strokeWidth={3}/> : <TrendingDown size={16} strokeWidth={3}/>}
                                    <span>{isProfit ? '+' : ''}{pnlPercent.toFixed(1)}%</span>
                                </div>
                              </div>
                          )}
                          
                          <div className="flex gap-2 mt-4">
                            <button className="flex-1 bg-brand-yellow text-black py-3 border-[3px] border-black font-black uppercase text-sm shadow-[4px_4px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none text-center transition-all">
                              View QR
                            </button>
                            <button 
                                disabled={!isTradingLive}
                                className="flex-1 bg-black text-white py-3 border-[3px] border-black font-black uppercase text-sm shadow-[4px_4px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:translate-x-1 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ArrowRightLeft size={16} strokeWidth={3} />
                                {isTradingLive ? 'List Asset' : 'Halted'}
                            </button>
                          </div>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-green border-b-[4px] border-black">
                  <th className="p-4 font-black uppercase tracking-widest border-r-[4px] border-black whitespace-nowrap">Order ID</th>
                  <th className="p-4 font-black uppercase tracking-widest border-r-[4px] border-black">Asset</th>
                  <th className="p-4 font-black uppercase tracking-widest border-r-[4px] border-black">Type</th>
                  <th className="p-4 font-black uppercase tracking-widest border-r-[4px] border-black text-right">Price</th>
                  <th className="p-4 font-black uppercase tracking-widest border-r-[4px] border-black text-right">Qty</th>
                  <th className="p-4 font-black uppercase tracking-widest border-r-[4px] border-black text-right whitespace-nowrap">Fee</th>
                  <th className="p-4 font-black uppercase tracking-widest border-r-[4px] border-black text-right whitespace-nowrap">Total</th>
                  <th className="p-4 font-black uppercase tracking-widest border-r-[4px] border-black whitespace-nowrap">Time</th>
                  <th className="p-4 font-black uppercase tracking-widest border-r-[4px] border-black">Status</th>
                  <th className="p-4 font-black uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center font-bold text-gray-500 uppercase tracking-widest">
                      No order history found.
                    </td>
                  </tr>
                ) : (
                  visibleOrders.map((order, idx) => {
                    const event = getEventForTicket(order.eventId);
                    return (
                      <tr key={order.id} className={`${idx !== visibleOrders.length - 1 ? 'border-b-[4px] border-black' : ''} hover:bg-gray-50 transition-colors`}>
                        <td className="p-4 font-mono font-bold text-gray-600 border-r-[4px] border-black">{order.id}</td>
                        <td className="p-4 border-r-[4px] border-black">
                           <p className="font-black uppercase truncate max-w-[200px]">{event?.title}</p>
                           <p className="font-bold text-xs text-gray-500 uppercase">{order.ticketClass}</p>
                        </td>
                        <td className="p-4 border-r-[4px] border-black">
                           <span className={`px-2 py-1 border-[2px] border-black font-black text-sm uppercase shadow-[2px_2px_0px_#000] ${
                             order.type === 'buy' ? 'bg-brand-green text-black' : 'bg-[#ff5f56] text-white'
                           }`}>
                             {order.type}
                           </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-right border-r-[4px] border-black text-lg">{order.priceSui.toFixed(2)} SUI</td>
                        <td className="p-4 font-mono font-bold text-right border-r-[4px] border-black text-lg">{order.quantity}</td>
                        <td className="p-4 font-mono text-right border-r-[4px] border-black text-xs">
                          {order.status === 'filled' ? (
                            <div className="flex flex-col gap-0.5">
                              <span>{(order.platformFee || 0).toFixed(4)}</span>
                              {order.type === 'sell' && <span className="text-red-500">+{(order.sellTax || 0).toFixed(4)} tax</span>}
                            </div>
                          ) : <span className="text-gray-400">-</span>}
                        </td>
                        <td className="p-4 font-mono font-bold text-right border-r-[4px] border-black">
                          {order.status === 'filled' ? (
                            <span className={order.type === 'buy' ? 'text-red-600' : 'text-green-600'}>
                              {order.type === 'buy' ? '-' : '+'}{(order.totalCost || 0).toFixed(4)}
                            </span>
                          ) : <span className="text-gray-400">-</span>}
                        </td>
                        <td className="p-4 font-bold text-gray-500 text-sm border-r-[4px] border-black whitespace-nowrap">
                           {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                        </td>
                        <td className="p-4 border-r-[4px] border-black">
                           {order.status === 'open' && <span className="flex items-center gap-2 font-bold text-gray-600 uppercase text-xs"><Clock size={16}/> Open</span>}
                           {order.status === 'filled' && <span className="flex items-center gap-2 font-bold text-green-600 uppercase text-xs"><CheckCircle2 size={16}/> Filled</span>}
                           {order.status === 'cancelled' && <span className="flex items-center gap-2 font-bold text-red-600 uppercase text-xs"><XCircle size={16}/> Cancelled</span>}
                        </td>
                        <td className="p-4 text-center">
                          {order.status === 'open' ? (
                            <button 
                              onClick={() => cancelOrder(order.id)}
                              className="px-4 py-2 bg-black text-white font-bold uppercase text-xs hover:bg-red-500 transition-colors"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-gray-400 font-bold">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-pink border-b-[4px] border-black">
                  <th className="p-4 font-black uppercase tracking-widest border-r-[4px] border-black text-black">Asset Position</th>
                  <th className="p-4 font-black uppercase tracking-widest border-r-[4px] border-black text-right text-black">Avg Buy Price</th>
                  <th className="p-4 font-black uppercase tracking-widest border-r-[4px] border-black text-right text-black">Sell Price</th>
                  <th className="p-4 font-black uppercase tracking-widest border-r-[4px] border-black text-right text-black">Realized PnL (Total)</th>
                  <th className="p-4 font-black uppercase tracking-widest border-r-[4px] border-black text-center text-black">Result</th>
                </tr>
              </thead>
              <tbody>
                {orders.filter(o => o.type === 'sell' && o.status === 'filled').length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center font-bold text-gray-500 uppercase tracking-widest">
                      No active trades found.
                    </td>
                  </tr>
                ) : (
                  orders.filter(o => o.type === 'sell' && o.status === 'filled').map((order, idx) => {
                    const event = getEventForTicket(order.eventId);
                    const avgEntryPrice = (order as any).avgBuyPrice || 0;
                    const sellPrice = order.priceSui;
                    
                    const pnl = sellPrice - avgEntryPrice;
                    const totalPnl = pnl * order.quantity;
                    const isProfit = pnl > 0;
                    const isNeutral = pnl === 0;

                    return (
                      <tr key={order.id} className={`${idx !== orders.length - 1 ? 'border-b-[4px] border-black' : ''} hover:bg-gray-50 transition-colors`}>
                        <td className="p-4 border-r-[4px] border-black">
                           <p className="font-black uppercase truncate max-w-[300px]">{event?.title}</p>
                           <p className="font-bold text-xs text-gray-500 uppercase">{order.ticketClass} (x{order.quantity} SOLD)</p>
                        </td>
                        <td className="p-4 font-mono font-bold text-right border-r-[4px] border-black text-lg">{avgEntryPrice.toFixed(2)} SUI</td>
                        <td className="p-4 font-mono font-bold text-right border-r-[4px] border-black text-lg">{sellPrice.toFixed(2)} SUI</td>
                        <td className={`p-4 font-mono font-black text-right border-r-[4px] border-black text-xl ${isProfit ? 'text-green-600' : isNeutral ? 'text-gray-500' : 'text-red-500'}`}>
                           {isProfit ? '+' : ''}{totalPnl.toFixed(2)} SUI
                        </td>
                        <td className="p-4 text-center font-black uppercase tracking-widest">
                           {isProfit ? (
                             <span className="bg-brand-green border-[3px] border-black px-4 py-2 shadow-[2px_2px_0px_#000] text-black tracking-widest">THẮNG</span>
                           ) : isNeutral ? (
                             <span className="bg-gray-200 border-[3px] border-black px-4 py-2 shadow-[2px_2px_0px_#000] text-gray-600">HÒA</span>
                           ) : (
                             <span className="bg-[#ff5f56] border-[3px] border-black px-4 py-2 shadow-[2px_2px_0px_#000] text-white tracking-widest">LỖ</span>
                           )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {orders.filter(o => o.type === 'sell' && o.status === 'filled').length > 0 && (() => {
                const soldOrders = orders.filter(o => o.type === 'sell' && o.status === 'filled');
                const totalRealizedPnL = soldOrders.reduce((sum, order) => {
                  const p = order.priceSui - ((order as any).avgBuyPrice || 0);
                  return sum + (p * order.quantity);
                }, 0);
                const isTotalProfit = totalRealizedPnL >= 0;

                return (
                  <tfoot>
                    <tr className="bg-brand-yellow border-t-[4px] border-black">
                      <td colSpan={3} className="p-4 font-black uppercase tracking-widest border-r-[4px] border-black text-right text-xl">
                        TOTAL REALIZED PnL:
                      </td>
                      <td className={`p-4 font-mono font-black text-right border-r-[4px] border-black text-2xl ${isTotalProfit ? 'text-green-700' : 'text-red-700'}`}>
                        {isTotalProfit ? '+' : ''}{totalRealizedPnL.toFixed(2)} SUI
                      </td>
                      <td className="p-4 text-center font-black uppercase tracking-widest">
                         {isTotalProfit ? (
                           <span className="text-green-700 text-xl tracking-widest">WINNING 🚀</span>
                         ) : (
                           <span className="text-red-700 text-xl tracking-widest">DOWN 📉</span>
                         )}
                      </td>
                    </tr>
                  </tfoot>
                );
              })()}
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
