import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';
import { X, QrCode, ArrowRightLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { fetchEvents } from '../api/backendApi';
import type { Event } from '../types';
import { useState, useEffect } from 'react';

export function MyTicketsModal() {
  const { userOwnedTickets, isMyTicketsOpen, setMyTicketsOpen } = useAppStore();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  const getEventForTicket = (eventId: string) => events.find(e => e.id === eventId);

  return (
    <AnimatePresence>
      {isMyTicketsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-4xl bg-brand-bg border-[4px] border-black shadow-[16px_16px_0px_#000] overflow-hidden flex flex-col h-[80vh] relative"
          >
                        <div className="p-6 md:p-8 bg-brand-green border-b-[4px] border-black flex justify-between items-center z-10 shrink-0">
               <div>
                 <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">My Vault</h2>
                 <p className="font-bold text-lg mt-1 border-[2px] border-black bg-white inline-block px-3 shadow-[2px_2px_0px_#000]">
                   {userOwnedTickets.length} Digital Assets
                 </p>
               </div>
               <button 
                 onClick={() => setMyTicketsOpen(false)}
                 className="w-12 h-12 bg-white border-[4px] border-black rounded-sm flex items-center justify-center hover:bg-black hover:text-white transition-all text-black neo-btn shadow-[4px_4px_0px_#000]"
               >
                 <X strokeWidth={4} />
               </button>
            </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              {userOwnedTickets.length === 0 ? (
                 <div className="w-full h-full flex flex-col items-center justify-center bg-white border-[4px] border-black border-dashed opacity-80">
                   <span className="text-8xl mb-6">🪹</span>
                   <h3 className="text-3xl font-black uppercase tracking-tighter">Vault Empty</h3>
                   <p className="font-bold text-gray-500 mt-2">You haven't purchased any tickets yet.</p>
                   <button 
                     onClick={() => setMyTicketsOpen(false)}
                     className="mt-6 px-8 py-3 bg-brand-yellow font-black uppercase text-xl border-[4px] border-black shadow-[6px_6px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
                   >
                     Explore Markets
                   </button>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                   {userOwnedTickets.map((ticket, idx) => {
                     const event = getEventForTicket(ticket.eventId);
                     const isTradingLive = event?.tradingStatus === 'Live';

                     const marketStat = event?.marketStats.find(s => s.ticketClass === ticket.ticketClass);
                     const currentFloor = marketStat?.floorPrice ?? ticket.priceSui;
                     const pnl = currentFloor - ticket.priceSui;
                     const pnlPercent = (pnl / ticket.priceSui) * 100;
                     const isProfit = pnl >= 0;

                     return (
                        <div key={`${ticket.id}-${idx}`} className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] flex flex-col relative group transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_#000]">
                          <div className="bg-brand-blue p-4 border-b-[4px] border-black flex justify-between items-center text-white">
                             <span className="font-black uppercase tracking-widest text-stroke-white" style={{ WebkitTextStroke: '1px black', textShadow: '2px 2px 0 #000'}}>{ticket.ticketClass}</span>
                             <div className="w-10 h-10 bg-white rounded-full border-[3px] border-black flex items-center justify-center text-black">
                               <QrCode size={20} strokeWidth={3} />
                             </div>
                          </div>

                          <div className="p-6 flex flex-col gap-4">
                             <div>
                               <p className="text-xs uppercase font-extrabold text-gray-500">Event</p>
                               <h4 className="text-2xl font-black uppercase leading-tight line-clamp-2">{event?.title}</h4>
                             </div>

                             <div className="flex flex-col gap-2 border-t-[3px] border-black border-dashed pt-4 mt-2">
                                <div className="flex justify-between items-end">
                                   <div>
                                     <p className="text-[10px] font-bold text-gray-400 uppercase">Token ID</p>
                                     <p className="font-mono font-bold tracking-widest">{ticket.id}</p>
                                   </div>
                                   <div className="text-right">
                                     <p className="text-[10px] font-bold text-gray-400 uppercase">Bought At</p>
                                     <p className="font-mono font-black">{ticket.priceSui} SUI</p>
                                   </div>
                                </div>

                                                                {isTradingLive && (
                                   <div className={`mt-2 flex justify-between items-center px-3 py-2 border-[2px] border-black font-bold ${isProfit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      <span className="text-xs uppercase tracking-widest">Curr. Floor: {currentFloor} SUI</span>
                                      <div className="flex items-center gap-1">
                                         {isProfit ? <TrendingUp size={16} strokeWidth={3}/> : <TrendingDown size={16} strokeWidth={3}/>}
                                         <span>{isProfit ? '+' : ''}{pnlPercent.toFixed(1)}% ({isProfit ? '+' : ''}{pnl.toFixed(1)} SUI)</span>
                                      </div>
                                   </div>
                                )}

                                <div className="flex gap-2 mt-2">
                                  <button className="flex-1 bg-brand-yellow text-black py-2 border-[3px] border-black font-black uppercase text-sm shadow-[2px_2px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none text-center">
                                    View QR
                                  </button>
                                  <button 
                                     disabled={!isTradingLive}
                                     className="flex-1 bg-black text-white py-2 border-[3px] border-black font-black uppercase text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:translate-x-1 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                     <ArrowRightLeft size={16} strokeWidth={3} />
                                     {isTradingLive ? 'List Asset' : 'Halted'}
                                  </button>
                                </div>
                             </div>
                          </div>

                                                    <div className="w-6 h-6 border-r-[4px] border-black bg-brand-bg rounded-r-full absolute top-[52px] -left-1"></div>
                          <div className="w-6 h-6 border-l-[4px] border-black bg-brand-bg rounded-l-full absolute top-[52px] -right-1"></div>
                        </div>
                     );
                   })}
                 </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
