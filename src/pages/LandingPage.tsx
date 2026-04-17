import { useAppStore } from '../store';
import { motion } from 'motion/react';
import { ArrowRight, Ticket as TicketIcon, Activity, Flame } from 'lucide-react';

export function LandingPage() {
  const { setActivePage } = useAppStore();

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}
      ></div>

      {/* Simplified Neo-Nav for Landing */}
      <nav className="relative z-20 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
         <div className="bg-black px-4 py-2 rotate-[-2deg] border-[3px] border-black shadow-[4px_4px_0px_#000] inline-flex">
            <span className="text-2xl font-black uppercase tracking-tighter mix-blend-difference text-white">FairTicket</span>
         </div>
         <button 
           onClick={() => setActivePage('markets')}
           className="hidden md:flex ml-4 bg-brand-green border-[3px] border-black px-6 py-2 font-black uppercase tracking-widest shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all items-center gap-2"
         >
            Launch App <ArrowRight size={20} strokeWidth={3} />
         </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-10 pb-20 max-w-7xl mx-auto w-full">
         
         <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="inline-flex items-center gap-2 bg-brand-yellow px-4 py-2 border-[3px] border-black font-bold uppercase text-sm shadow-[4px_4px_0px_#000] mb-8 z-20"
         >
           <Flame size={18} fill="currentColor" /> Web3 Native Ticketing Exchange
         </motion.div>

         <motion.div 
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ delay: 0.1 }}
           className="relative mb-8 z-20"
         >
            <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black uppercase tracking-tighter leading-[0.85] text-black mix-blend-hard-light relative z-20">
              TRADE TICKETS
            </h1>
            <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black uppercase tracking-tighter leading-[0.9] text-stroke-purple text-transparent relative z-20">
              LIKE CRYPTO.
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[40%] bg-brand-pink z-10 -rotate-2 border-[3px] border-black"></div>
         </motion.div>

         <motion.p 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="text-xl md:text-2xl font-bold max-w-2xl text-gray-800 leading-snug mb-12 z-20 px-4"
         >
           The premier decentralized exchange for live events. Buy early. Trade dynamically on our order books. Secure your spot.
         </motion.p>

         <motion.button 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.3 }}
           onClick={() => setActivePage('markets')}
           className="bg-black text-white text-2xl md:text-4xl font-black uppercase tracking-widest px-12 py-6 border-[6px] border-black shadow-[12px_12px_0px_#00ff88] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all flex items-center gap-4 group z-20"
         >
           Launch App 
           <ArrowRight className="group-hover:translate-x-2 transition-transform" size={40} strokeWidth={4} />
         </motion.button>
         
         {/* Floating Elements / Decorative */}
         <div className="absolute top-32 left-10 md:left-20 w-24 h-24 bg-brand-blue border-[4px] border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_#000] rotate-12 z-0 animate-[bounce_4s_infinite]">
            <TicketIcon size={40} className="text-white" strokeWidth={3} />
         </div>
         
         <div className="absolute bottom-40 right-10 md:right-32 w-28 h-28 bg-[#ff5f56] border-[4px] border-black flex items-center justify-center shadow-[8px_8px_0px_#000] -rotate-12 z-0">
            <Activity size={48} className="text-white" strokeWidth={3} />
         </div>

         {/* Ticket Cutout Graphic Background */}
         <div className="absolute -bottom-20 -left-10 w-64 h-64 border-[4px] border-black bg-white shadow-[12px_12px_0px_#000] rotate-6 z-0 hidden lg:flex flex-col opacity-50">
             <div className="flex-1 bg-brand-purple border-b-[4px] border-black"></div>
             <div className="h-2/3 p-4 flex flex-col gap-2 relative">
                <div className="w-full h-4 bg-gray-200"></div>
                <div className="w-3/4 h-4 bg-gray-200"></div>
                <div className="w-full border-t border-dashed border-gray-400 mt-4"></div>
                {/* Notch */}
                <div className="absolute right-[-24px] top-4 w-10 h-10 border-[4px] border-black rounded-full bg-brand-bg"></div>
             </div>
         </div>
      </main>

      {/* Scrolling Ticker Footer */}
      <div className="w-full bg-black text-white py-3 border-y-[4px] border-black overflow-hidden z-20 mt-auto flex">
         <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] font-black uppercase text-xl md:text-2xl tracking-widest items-center">
            <span className="mx-4 text-[#00ff88]">◆</span> FULLY ON-CHAIN <span className="mx-4 text-brand-yellow">◆</span> SUI NETWORK <span className="mx-4 text-[#00ff88]">◆</span> ZERO GAS FEES <span className="mx-4 text-brand-pink">◆</span> DYNAMIC PRICING <span className="mx-4 text-[#00ff88]">◆</span> FULLY ON-CHAIN <span className="mx-4 text-brand-yellow">◆</span> SUI NETWORK <span className="mx-4 text-[#00ff88]">◆</span> ZERO GAS FEES <span className="mx-4 text-brand-pink">◆</span> DYNAMIC PRICING
            <span className="mx-4 text-[#00ff88]">◆</span> FULLY ON-CHAIN <span className="mx-4 text-brand-yellow">◆</span> SUI NETWORK <span className="mx-4 text-[#00ff88]">◆</span> ZERO GAS FEES <span className="mx-4 text-brand-pink">◆</span> DYNAMIC PRICING
         </div>
      </div>
    </div>
  );
}
