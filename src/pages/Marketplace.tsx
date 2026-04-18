import { useState, useEffect } from 'react';
import { EventExplorer } from '../components/EventExplorer';
import { Navbar } from '../components/Navbar';
import { TicketModal } from '../components/TicketModal';
import { EventDetailModal } from '../components/EventDetailModal';
import { CheckoutOverlay } from '../components/CheckoutOverlay';
import { CartDrawer } from '../components/CartDrawer';
// We don't need MyTicketsModal anymore since we have Dashboard
import { Dashboard } from './Dashboard';
import type { Event } from '../types';
import { AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';

export function Marketplace() {
  const { activePage, viewingEvent, setViewingEvent } = useAppStore();
  const [purchasingEvent, setPurchasingEvent] = useState<Event | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTradeComplete = () => {
    setIsCheckingOut(true);
    setCheckoutSuccess(false);

    // Instead of legacy `.purchaseTickets()` simulating cart behavior, we just show the
    // transaction broadcast signature process for the limit order.
    setTimeout(() => {
       setCheckoutSuccess(true);
       setPurchasingEvent(null); // Clear the background modal
       // Keep Checkout Overlay open until user manually closes it or navigates
    }, 2000);
  };

  const handleBuyIntent = (event: Event) => {
    setViewingEvent(null);
    setPurchasingEvent(event);
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <CartDrawer onCheckout={handleTradeComplete} />
      
      {activePage === 'markets' ? (
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden pt-12 pb-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between">
            <div className="flex-1 mt-6">
              <div className="inline-block bg-brand-yellow neo-btn rounded-full px-6 py-2 font-bold mb-10 italic border-[3px] border-black text-lg shadow-[4px_4px_0px_#000]">
                Welcome to FairTicket Exchange 📈
              </div>
              
              <div className="flex flex-col mb-8 items-start relative">
                <h1 className="text-stroke-white text-[90px] md:text-[140px] font-black uppercase leading-[0.85] tracking-tighter mix-blend-hard-light relative z-20">
                  TRADE
                </h1>
                <h1 className="text-stroke-purple text-[80px] md:text-[130px] font-black uppercase leading-[0.85] tracking-tighter relative z-20">
                  TICKETS
                </h1>
                <h1 className="text-black text-[50px] md:text-[110px] font-black uppercase leading-[0.85] tracking-tighter relative z-20 mt-1">
                  LIKE CRYPTO
                </h1>
                <div className="absolute bottom-[-15px] left-0 w-[110%] h-6 bg-brand-green z-10 rotate-1 border-[2px] border-black"></div>
              </div>

              <div className="relative mb-10 max-w-xl left-4">
                 <div className="absolute w-12 h-12 bg-brand-yellow border-[3px] border-black rounded-full -left-8 -top-4 -z-10 shadow-[2px_2px_0px_#000]"></div>
                 <p className="text-2xl font-bold mb-2 uppercase tracking-tighter">Buy early. Flip for profit.</p>
                 <div className="inline-block bg-brand-green border-[3px] border-black px-4 py-2 text-xl md:text-2xl font-black shadow-[4px_4px_0px_#000] mb-4 uppercase">
                    Diamond hand to the event.
                 </div>
                 <p className="text-xl font-bold text-gray-800 tracking-tight leading-snug">
                    Event tickets re-imagined as dynamic assets. Trade securely on our order books. Lists lock when the event starts.
                 </p>
              </div>
            </div>
            
            <div className="hidden lg:flex w-[420px] mt-8 relative group z-10 ml-12">
              <div className="w-full bg-white border-[4px] border-black flex flex-col shadow-[16px_16px_0px_#000] rotate-[6deg] group-hover:rotate-[0deg] transition-all duration-300 relative z-10">
                
                {/* Ticket Header */}
                <div className="bg-brand-purple border-b-[4px] border-black p-4 flex justify-between items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#000] opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)" }}></div>
                  <span className="font-black text-white text-3xl tracking-widest uppercase relative z-10 text-stroke-white" style={{ WebkitTextStroke: '1px black', textShadow: '2px 2px 0 #000'}}>HOT PASS</span>
                  <div className="w-10 h-10 rounded-full border-[3px] border-black bg-brand-yellow flex items-center justify-center font-bold text-lg relative z-10 shadow-[2px_2px_0px_#000]">★</div>
                </div>
                
                {/* Ticket Image & Badge */}
                <div className="h-[220px] bg-brand-bg px-6 py-6 relative border-b-[4px] border-black overflow-hidden flex items-center justify-center">
                   <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop" className="w-full h-full object-cover border-[3px] border-black shadow-[6px_6px_0px_#000] rotate-[-3deg] grayscale group-hover:grayscale-0 transition-all duration-500" alt="Concert" referrerPolicy="no-referrer" />
                   <div className="absolute top-4 right-4 bg-brand-green border-[3px] border-black px-3 py-1 transform rotate-[15deg] font-black uppercase text-sm z-20 shadow-[4px_4px_0px_#000]">
                     +42.0% (24H)
                   </div>
                </div>
                
                {/* Ticket Details */}
                <div className="p-8 pb-10 bg-white flex flex-col relative">
                   <div className="flex justify-between items-end mb-6">
                     <div>
                       <p className="text-gray-500 font-extrabold uppercase text-xs tracking-widest mb-1">Index Price</p>
                       <h3 className="text-4xl font-black uppercase leading-[0.9]">250 SUI</h3>
                     </div>
                   </div>
                   
                   <div className="flex justify-between border-t-[4px] border-black border-dashed pt-4 mb-8">
                     <div>
                       <p className="text-gray-500 font-bold text-xs uppercase mb-1">Volume</p>
                       <p className="font-black text-xl italic">5.5K SUI</p>
                     </div>
                     <div>
                       <p className="text-gray-500 font-bold text-xs uppercase text-right mb-1">Status</p>
                       <p className="font-black text-xl italic text-right text-brand-green uppercase">Live</p>
                     </div>
                   </div>

                   {/* Barcode Mock */}
                   <div className="w-full flex space-x-1 h-14 bg-white items-center justify-center opacity-80 mt-2">
                      <div className="w-2 h-full bg-black"></div>
                      <div className="w-1 h-full bg-black"></div>
                      <div className="w-4 h-full bg-black"></div>
                      <div className="w-1 h-full bg-black"></div>
                      <div className="w-3 h-full bg-black"></div>
                      <div className="w-1 h-full bg-black"></div>
                      <div className="w-5 h-full bg-black"></div>
                      <div className="w-2 h-full bg-black"></div>
                      <div className="w-1 h-full bg-black"></div>
                      <div className="w-3 h-full bg-black"></div>
                      <div className="w-2 h-full bg-black"></div>
                      <div className="w-4 h-full bg-black"></div>
                      <div className="w-1 h-full bg-black"></div>
                      <div className="w-3 h-full bg-black"></div>
                      <div className="w-2 h-full bg-black"></div>
                      <div className="w-1 h-full bg-black"></div>
                   </div>
                   <p className="text-center font-mono text-sm mt-3 font-bold tracking-[0.3em] uppercase">SUI-FT-000X1B</p>
                </div>
                
                {/* Ticket cutout notches (left and right of the dashed line) */}
                <div className="w-10 h-10 rounded-full bg-[#f4f4f5] border-r-[4px] border-t-[4px] border-b-[4px] border-black absolute -left-[5px] top-[265px] z-20"></div>
                <div className="w-10 h-10 rounded-full bg-[#f4f4f5] border-l-[4px] border-t-[4px] border-b-[4px] border-black absolute -right-[5px] top-[265px] z-20"></div>
              </div>
              
              {/* Decorative floating elements around the ticket */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-yellow border-[4px] border-black p-4 flex flex-col items-center justify-center shadow-[8px_8px_0px_#000] z-20 rotate-[-10deg] group-hover:rotate-[5deg] transition-transform">
                 <span className="text-brand-purple text-5xl mb-1 font-black" style={{ textShadow: '2px 2px 0 #000' }}>42</span>
                 <span className="font-black text-2xl uppercase tracking-tighter">ROI %</span>
              </div>
              
              <div className="absolute -top-10 -left-12 w-24 h-24 bg-brand-green border-[4px] border-black rounded-full shadow-[8px_8px_0px_#000] z-0 animate-[spin_10s_linear_infinite] flex items-center justify-center">
                 <span className="text-4xl">📈</span>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="px-4 md:px-8 max-w-7xl mx-auto pb-12">
            {isLoading ? (
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border-[4px] border-black rounded-[16px] h-[340px] animate-pulse p-4 flex flex-col shadow-[8px_8px_0px_#000]">
                      <div className="h-[140px] bg-gray-200 rounded-lg mb-4 border-[2px] border-black"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 border-[2px] border-black"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EventExplorer 
                onEventClick={setViewingEvent} 
              />
            )}
          </section>
        </>
      ) : (
        <Dashboard />
      )}

      {/* Modals & Overlays */}
      <AnimatePresence>
        {viewingEvent && !purchasingEvent && (
          <EventDetailModal 
            event={viewingEvent} 
            onClose={() => setViewingEvent(null)} 
            onBuyTickets={handleBuyIntent}
          />
        )}

        {purchasingEvent && !isCheckingOut && (
          <TicketModal 
            event={purchasingEvent} 
            onClose={() => setPurchasingEvent(null)} 
            onPurchaseComplete={handleTradeComplete}
          />
        )}
      </AnimatePresence>

      <CheckoutOverlay 
         isOpen={isCheckingOut} 
         isSuccess={checkoutSuccess} 
         onClose={() => setIsCheckingOut(false)}
         onNavigateVault={() => {
            setIsCheckingOut(false);
            useAppStore.getState().setActivePage('dashboard');
         }}
      />
    </div>
  );
}
