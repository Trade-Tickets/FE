import { useAppStore } from '../store';
import { motion } from 'motion/react';
import { ArrowRight, Ticket as TicketIcon, Activity, Flame, ShieldCheck, Zap, Coins, Globe, Search, Music } from 'lucide-react';
import { EventExplorer } from '../components/EventExplorer';
export function LandingPage() {
  const { setActivePage, setViewingEvent } = useAppStore();
  return (
    <div className="min-h-screen bg-brand-bg text-black font-sans overflow-x-hidden selection:bg-brand-pink selection:text-white">
      <nav className="fixed top-0 w-full z-50 bg-brand-bg/90 backdrop-blur-md border-b-[4px] border-black">
         <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
             <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="w-12 h-12 border-[3px] border-black bg-white shadow-[4px_4px_0px_#fde047] rotate-[2deg] rounded-lg overflow-hidden flex items-center justify-center group-hover:rotate-0 transition-transform">
                   <img src="/logo.jpg" alt="FairTicket Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="bg-black px-4 py-2 rotate-[-2deg] border-[3px] border-black shadow-[4px_4px_0px_#fde047] group-hover:rotate-0 transition-transform">
                   <span className="text-2xl font-black uppercase tracking-tighter mix-blend-difference text-white">FairTicket</span>
                </div>
             </div>
             <div className="hidden md:flex gap-8 font-black uppercase tracking-widest text-sm items-center">
                <a href="#features" className="hover:text-brand-purple hover:underline decoration-4 underline-offset-4 transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-brand-blue hover:underline decoration-4 underline-offset-4 transition-colors">How it works</a>
                <button onClick={() => setActivePage('markets')} className="hover:text-brand-green hover:underline decoration-4 underline-offset-4 transition-colors uppercase">Market</button>
             </div>
             <button 
               onClick={() => setActivePage('markets')}
               className="hidden md:flex bg-brand-green border-[3px] border-black px-6 py-2 font-black uppercase tracking-widest shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all items-center gap-2"
             >
                Launch App <ArrowRight size={20} strokeWidth={3} />
             </button>
         </div>
      </nav>
      <section className="relative w-full pt-40 pb-20 px-4 min-h-[90vh] flex flex-col justify-center items-center border-b-[4px] border-black overflow-hidden bg-brand-bg">
          <div 
            className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}
          ></div>
          <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center text-center">
             <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="inline-flex items-center gap-2 bg-brand-yellow px-4 py-2 border-[3px] border-black font-bold uppercase text-sm shadow-[4px_4px_0px_#000] mb-8"
             >
               <Flame size={18} fill="currentColor" /> Web3 Native Ticketing Exchange
             </motion.div>
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.1 }}
               className="relative mb-8 z-20 w-full"
             >
                <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black uppercase tracking-tighter leading-[0.85] text-black">
                  TRADE TICKETS
                </h1>
                <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black uppercase tracking-tighter leading-[0.9] text-stroke-purple text-transparent relative z-20 mt-2">
                  LIKE CRYPTO.
                </h1>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[40%] bg-brand-pink z-[-1] -rotate-2 border-[4px] border-black"></div>
             </motion.div>
             <motion.p 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-xl md:text-2xl font-bold max-w-3xl text-gray-800 leading-relaxed mb-12 px-4 bg-white/50 backdrop-blur-sm p-4 border-[3px] border-black rounded-lg shadow-[6px_6px_0px_#000]"
             >
               The premier decentralized exchange for live events. Buy early. Trade dynamically on our order books. Secure your spot or flip for profit.
             </motion.p>
             <motion.button 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.3 }}
               onClick={() => setActivePage('markets')}
               className="bg-black text-white text-2xl md:text-4xl font-black uppercase tracking-widest px-12 py-6 border-[6px] border-black shadow-[12px_12px_0px_#00ff88] hover:translate-x-3 hover:translate-y-3 hover:shadow-none transition-all flex items-center gap-4 group hover:text-[#00ff88]"
             >
               Launch App 
               <ArrowRight className="group-hover:translate-x-2 transition-transform" size={40} strokeWidth={4} />
             </motion.button>
          </div>
          <motion.div 
             animate={{ y: [0, -20, 0], rotate: [12, 15, 12] }}
             transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
             className="absolute top-40 left-[10%] hidden md:flex w-24 h-24 lg:w-32 lg:h-32 bg-brand-blue border-[4px] border-black rounded-full items-center justify-center shadow-[8px_8px_0px_#000]"
          >
             <TicketIcon size={48} className="text-white" strokeWidth={2.5} />
          </motion.div>
          <motion.div 
             animate={{ y: [0, 20, 0], rotate: [-12, -15, -12] }}
             transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-32 right-[10%] hidden md:flex w-24 h-24 lg:w-32 lg:h-32 bg-[#ff5f56] border-[4px] border-black items-center justify-center shadow-[10px_10px_0px_#000]"
          >
             <Activity size={48} className="text-white" strokeWidth={2.5} />
          </motion.div>
      </section>
      <div className="w-full bg-black text-white py-4 border-b-[4px] border-black overflow-hidden flex">
         <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] font-black uppercase text-xl md:text-2xl tracking-widest items-center">
            <span className="mx-6 text-brand-green">◆</span> FULLY ON-CHAIN <span className="mx-6 text-brand-yellow">◆</span> SUI NETWORK <span className="mx-6 text-brand-green">◆</span> ZERO GAS FEES <span className="mx-6 text-brand-pink">◆</span> DYNAMIC PRICING <span className="mx-6 text-brand-blue">◆</span> SECURE & VERIFIED
            <span className="mx-6 text-brand-green">◆</span> FULLY ON-CHAIN <span className="mx-6 text-brand-yellow">◆</span> SUI NETWORK <span className="mx-6 text-brand-green">◆</span> ZERO GAS FEES <span className="mx-6 text-brand-pink">◆</span> DYNAMIC PRICING <span className="mx-6 text-brand-blue">◆</span> SECURE & VERIFIED
            <span className="mx-6 text-brand-green">◆</span> FULLY ON-CHAIN
         </div>
      </div>
      <section className="bg-brand-bg border-b-[6px] border-black pb-12">
        <EventExplorer onEventClick={(event) => {
          setViewingEvent(event);
          setActivePage('markets');
        }} />
      </section>
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto w-full relative pt-32 shrink-0">
         <div className="text-center mb-20 mt-4">
            <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter inline-block relative">
               Why <span className="text-stroke-white text-transparent bg-clip-text">FairTicket?</span>
               <div className="absolute -bottom-4 left-0 w-full h-[6px] bg-black"></div>
               <div className="absolute -bottom-4 left-2 w-full h-[6px] bg-brand-yellow -z-10"></div>
            </h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
            <div className="bg-brand-purple p-8 border-[4px] border-black shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all group">
               <div className="w-20 h-20 bg-white border-[4px] border-black flex items-center justify-center mb-8 shadow-[6px_6px_0px_#000] rotate-3 group-hover:rotate-12 transition-transform">
                  <ShieldCheck size={40} className="text-black" strokeWidth={2.5} />
               </div>
               <h3 className="text-3xl font-black uppercase mb-4">No More Fakes</h3>
               <p className="text-xl font-bold leading-relaxed text-black/90">
                  Every ticket is a digital asset minted on the blockchain. Verifiable authenticity means you'll never buy a fake ticket again.
               </p>
            </div>
            <div className="bg-brand-yellow p-8 border-[4px] border-black shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all group">
               <div className="w-20 h-20 bg-white border-[4px] border-black flex items-center justify-center mb-8 shadow-[6px_6px_0px_#000] -rotate-3 group-hover:-rotate-12 transition-transform">
                  <Activity size={40} className="text-black" strokeWidth={2.5} />
               </div>
               <h3 className="text-3xl font-black uppercase mb-4">Dynamic Markets</h3>
               <p className="text-xl font-bold leading-relaxed text-black/90">
                  Bid and ask in real-time. Let the market decide the fair price. Event sold out? Join the order book and snap up a ticket if the price drops.
               </p>
            </div>
            <div className="bg-brand-green p-8 border-[4px] border-black shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all group">
               <div className="w-20 h-20 bg-white border-[4px] border-black flex items-center justify-center mb-8 shadow-[6px_6px_0px_#000] rotate-6 group-hover:-rotate-6 transition-transform">
                  <Zap size={40} className="text-black" strokeWidth={2.5} />
               </div>
               <h3 className="text-3xl font-black uppercase mb-4">Instant Settlement</h3>
               <p className="text-xl font-bold leading-relaxed text-black/90">
                  Powered by the Sui Network. Zero waiting, zero BS. Trades happen instantly and your ticket is in your wallet before you can blink.
               </p>
            </div>
         </div>
      </section>
      <section id="how-it-works" className="py-24 border-y-[6px] border-black bg-white overflow-hidden relative">
         <div 
           className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 10px)' }}
         ></div>
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-12 text-stroke-purple text-transparent">
                     HOW IT WORKS
                  </h2>
                  <div className="flex flex-col gap-10">
                     <div className="flex items-start gap-8 group">
                        <div className="bg-black text-white w-16 h-16 shrink-0 flex items-center justify-center text-3xl font-black border-[4px] border-brand-bg shadow-[6px_6px_0px_#c084fc] group-hover:scale-110 transition-transform -rotate-6">1</div>
                        <div>
                           <h4 className="text-3xl font-black uppercase mb-3">Find an Event</h4>
                           <p className="text-xl font-bold text-gray-700 leading-snug">Browse trending markets or search for your favorite artists and festivals.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-8 group">
                        <div className="bg-black text-white w-16 h-16 shrink-0 flex items-center justify-center text-3xl font-black border-[4px] border-brand-bg shadow-[6px_6px_0px_#fde047] group-hover:scale-110 transition-transform rotate-3">2</div>
                        <div>
                           <h4 className="text-3xl font-black uppercase mb-3">Place an Order</h4>
                           <p className="text-xl font-bold text-gray-700 leading-snug">Buy immediately at the lowest ask, or place a limit bid at your desired price.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-8 group">
                        <div className="bg-black text-white w-16 h-16 shrink-0 flex items-center justify-center text-3xl font-black border-[4px] border-brand-bg shadow-[6px_6px_0px_#4ade80] group-hover:scale-110 transition-transform -rotate-3">3</div>
                        <div>
                           <h4 className="text-3xl font-black uppercase mb-3">Attend or Flip</h4>
                           <p className="text-xl font-bold text-gray-700 leading-snug">Scan your QR ticket at the door. Can't make it? Sell it instantly back to the market.</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="relative w-full max-w-lg mx-auto bg-brand-bg border-[6px] border-black shadow-[16px_16px_0px_#000] p-6 lg:p-8 flex flex-col md:rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b-[4px] border-black">
                     <div className="text-3xl font-black uppercase tracking-tight">Order Book</div>
                     <Activity size={36} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 flex flex-col gap-3 font-mono text-lg lg:text-xl font-bold">
                     <div className="flex justify-between text-red-500 bg-red-100/50 p-3 border-l-[6px] border-red-500">
                        <span>ASK</span><span>24.50 SUI</span><span>4 TIX</span>
                     </div>
                     <div className="flex justify-between text-red-500 bg-red-100/50 p-3 border-l-[6px] border-red-500">
                        <span>ASK</span><span>24.00 SUI</span><span>1 TIX</span>
                     </div>
                     <div className="my-4 py-4 text-center text-2xl lg:text-3xl font-black bg-black text-white border-[4px] border-black tracking-widest relative overflow-hidden group/price">
                        <div className="absolute inset-0 bg-brand-green -translate-x-full group-hover/price:translate-x-0 transition-transform duration-300"></div>
                        <span className="relative z-10 text-white mix-blend-difference">23.85 SUI</span>
                     </div>
                     <div className="flex justify-between text-green-600 bg-green-100/50 p-3 border-l-[6px] border-green-500">
                        <span>BID</span><span>23.00 SUI</span><span>2 TIX</span>
                     </div>
                     <div className="flex justify-between text-green-600 bg-green-100/50 p-3 border-l-[6px] border-green-500">
                        <span>BID</span><span>22.50 SUI</span><span>8 TIX</span>
                     </div>
                     <div className="flex justify-between text-green-600 bg-green-100/50 p-3 border-l-[6px] border-green-500">
                        <span>BID</span><span>20.00 SUI</span><span>20 TIX</span>
                     </div>
                  </div>
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 lg:w-32 lg:h-32 bg-brand-blue border-[4px] border-black rounded-full flex justify-center items-center shadow-[8px_8px_0px_#000]">
                     <Coins size={48} className="text-white" strokeWidth={2.5} />
                  </div>
               </div>
            </div>
         </div>
      </section>
      <section className="py-32 md:py-48 bg-brand-pink text-center px-4 border-b-[6px] border-black relative overflow-hidden">
         <div className="absolute top-10 left-10 md:left-20 text-black opacity-[0.08] lg:opacity-20 rotate-12 pointer-events-none">
            <Music size={200} />
         </div>
         <div className="absolute bottom-10 right-10 md:right-20 text-black opacity-[0.08] lg:opacity-20 -rotate-12 pointer-events-none">
            <Globe size={200} />
         </div>
         <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
            <h2 className="text-6xl md:text-8xl lg:text-[100px] font-black uppercase tracking-tighter mb-8 leading-none drop-shadow-[6px_6px_0px_#000] text-white">
               DON'T MISS OUT.
            </h2>
            <p className="text-2xl md:text-3xl font-bold mb-16 max-w-2xl text-black border-4 border-black p-6 bg-white/80 backdrop-blur shadow-[8px_8px_0px_#000]">
               Stop dealing with scalpers and hidden fees. Join the future of live event ticketing today.
            </p>
            <button 
              onClick={() => setActivePage('markets')}
              className="bg-black text-white text-3xl md:text-4xl font-black uppercase tracking-widest px-14 py-8 border-[6px] border-black shadow-[12px_12px_0px_#fde047] hover:translate-x-3 hover:translate-y-3 hover:shadow-none transition-all flex items-center justify-center gap-6 group hover:text-brand-yellow w-full max-w-xl mx-auto"
            >
               <Search size={40} className="stroke-[3px]" /> 
               <span>EXPLORE MARKETS</span>
            </button>
         </div>
      </section>
      <footer className="bg-brand-bg py-16 px-6 relative">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
                <div className="w-14 h-14 border-[4px] border-black bg-white shadow-[6px_6px_0px_#4ade80] rotate-[3deg] rounded-lg overflow-hidden flex items-center justify-center group-hover:-rotate-3 transition-transform">
                   <img src="/logo.jpg" alt="FairTicket Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="bg-black px-6 py-3 border-[4px] border-black shadow-[6px_6px_0px_#4ade80] -rotate-2 group-hover:rotate-0 transition-transform">
                   <span className="text-3xl font-black uppercase tracking-tight text-white mix-blend-difference">FairTicket</span>
                </div>
            </div>
            <div className="text-2xl font-bold uppercase tracking-widest text-center">
               Built on <span className="text-blue-500 font-black text-4xl align-middle mx-2 inline-block -mt-2">Sui</span>
            </div>
            <div className="flex gap-8 font-black uppercase text-xl">
               <a href="#" className="hover:text-brand-blue hover:-translate-y-1 transition-transform">Twitter</a>
               <a href="#" className="hover:text-brand-purple hover:-translate-y-1 transition-transform">Discord</a>
               <a href="#" className="hover:text-brand-pink hover:-translate-y-1 transition-transform">Docs</a>
            </div>
         </div>
         <div className="text-center w-full mt-16 font-bold text-gray-500 uppercase tracking-widest border-t-[4px] border-black pt-8 max-w-7xl mx-auto">
            © {new Date().getFullYear()} FairTicket. All rights reserved.
         </div>
      </footer>
    </div>
  );
}
