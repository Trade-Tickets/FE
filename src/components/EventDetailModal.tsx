import { motion } from 'motion/react';
import { Event } from '../mockData';
import { X, Calendar, MapPin, Users, Ticket as TicketIcon, Lock } from 'lucide-react';

interface EventDetailModalProps {
  event: Event | null;
  onClose: () => void;
  onBuyTickets: (event: Event) => void;
}

export function EventDetailModal({ event, onClose, onBuyTickets }: EventDetailModalProps) {
  if (!event) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-5xl h-[85vh] bg-white border-[4px] border-black flex flex-col md:flex-row shadow-[16px_16px_0px_#000] relative overflow-hidden"
      >
        {/* Mobile Close Button Container (Top right floating) */}
        <button 
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 z-50 w-10 h-10 bg-white border-[4px] border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <X strokeWidth={3} />
        </button>

        {/* Left Side: Artwork & Quick Info */}
        <div className="w-full md:w-5/12 border-b-[4px] md:border-b-0 md:border-r-[4px] border-black flex flex-col bg-brand-bg relative h-[40vh] md:h-full shrink-0">
           <img 
            src={event.coverImage} 
            alt={event.title} 
            className="w-full h-2/3 md:h-3/5 object-cover border-b-[4px] border-black grayscale hover:grayscale-0 transition-all duration-500"
            referrerPolicy="no-referrer" 
          />
          <div className="p-6 flex flex-col flex-grow justify-between">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {event.tradingStatus === 'Live' ? (
                  <span className="px-3 py-1 bg-brand-green border-[3px] border-black text-black rounded text-xs font-black uppercase shadow-[2px_2px_0px_#000]">
                    Market Live
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-400 text-white border-[3px] border-black rounded text-xs font-black uppercase shadow-[2px_2px_0px_#000] flex items-center gap-1">
                    <Lock size={12} strokeWidth={3} /> Trading {event.tradingStatus}
                  </span>
                )}
                {event.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-brand-yellow border-[3px] border-black text-black rounded text-xs font-black uppercase shadow-[2px_2px_0px_#000]">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-3xl lg:text-4xl font-black uppercase leading-none tracking-tighter mb-4">{event.title}</h2>
              
              <div className="space-y-3 font-bold text-gray-800">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-brand-purple" strokeWidth={3} />
                  <span className="text-lg">{event.date} • {event.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-brand-green" strokeWidth={3} />
                  <span className="text-lg">{event.location}</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block">
              <p className="text-sm uppercase font-extrabold text-gray-500 mb-2">Organized by</p>
              <div className="inline-block bg-white border-[3px] border-black px-4 py-2 font-black text-lg shadow-[4px_4px_0px_#000]">
                {event.organizer}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Scrollable Details & Action */}
        <div className="w-full md:w-7/12 flex flex-col bg-white overflow-hidden h-[45vh] md:h-full">
          {/* Header Actions */}
          <div className="hidden md:flex justify-end p-6 pb-0">
             <button 
                onClick={onClose}
                className="w-12 h-12 bg-white border-[4px] border-black flex items-center justify-center hover:bg-black hover:text-white transition-all text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000]"
              >
                <X strokeWidth={3} size={24} />
              </button>
          </div>

          <div className="p-6 md:p-8 md:pt-4 overflow-y-auto flex-grow flex flex-col gap-8 custom-scrollbar">
            
            {/* Warning Message about Snapshot/Settlement */}
            <div className="bg-brand-blue/10 border-[3px] border-black p-4 shadow-[4px_4px_0px_#000]">
                <h4 className="font-black uppercase tracking-widest text-brand-purple flex items-center gap-2 mb-1">
                   <Lock size={16} /> Settlement Notice
                </h4>
                <p className="font-bold text-sm text-gray-700">
                   Trading halts on <span className="font-black text-black">{event.settlementDate}</span>. After this date, all ticket holders will be snapshotted and official entry passes will be distributed to wallets. List your tickets before this deadline if you wish to sell.
                </p>
            </div>

            <section>
               <h3 className="text-2xl font-black uppercase mb-4 inline-block border-b-[4px] border-brand-green pb-1 tracking-wides">About</h3>
               <p className="text-lg font-bold text-gray-700 leading-relaxed bg-brand-bg p-6 border-[3px] border-black shadow-[6px_6px_0px_#000]">
                 {event.about}
               </p>
            </section>

            <section>
              <h3 className="text-2xl font-black uppercase mb-4 inline-block border-b-[4px] border-brand-purple pb-1 tracking-wides flex items-center gap-2">
                <Users strokeWidth={3} /> Lineup
              </h3>
              <div className="flex flex-wrap gap-3">
                {event.lineup.map((person, idx) => (
                   <div key={idx} className="bg-white border-[3px] border-black px-5 py-2 font-black text-black shadow-[4px_4px_0px_var(--color-brand-purple)] text-lg uppercase">
                     {person}
                   </div>
                ))}
              </div>
            </section>

            {/* Mobile Organizer */}
            <div className="md:hidden pt-4">
              <p className="text-sm uppercase font-extrabold text-gray-500 mb-2">Organized by</p>
              <div className="inline-block bg-white border-[3px] border-black px-4 py-2 font-black text-lg shadow-[4px_4px_0px_#000]">
                {event.organizer}
              </div>
            </div>
            
            {/* Empty space for scrolling buffer above fixed button */}
            <div className="h-4"></div>
          </div>

          {/* Sticky Trade Button */}
          <div className="border-t-[4px] border-black p-6 bg-brand-yellow shrink-0 z-10 w-full relative">
            <div className="absolute top-0 left-0 w-full h-[4px] bg-black"></div>
            
             <button 
                disabled={event.tradingStatus !== 'Live'}
                onClick={() => onBuyTickets(event)}
                className="w-full bg-black text-white px-6 py-5 border-[4px] border-black font-black text-2xl uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-brand-pink transition-colors group shadow-[8px_8px_0px_rgba(0,0,0,0.5)] active:translate-x-2 active:translate-y-2 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TicketIcon size={32} className="group-hover:rotate-12 transition-transform" />
                {event.tradingStatus === 'Live' ? 'Enter Trade Terminal' : 'Trading Halted'}
             </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
