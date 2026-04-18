import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';
import { X, Trash2, Ticket as TicketIcon } from 'lucide-react';
import { fetchEvents } from '../api/backendApi';
import type { Event } from '../types';
import { useState, useEffect } from 'react';

interface CartDrawerProps {
  onCheckout: () => void;
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { cart, isCartOpen, setCartOpen, removeFromCart, isWalletConnected } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  // Group cart items by event to show nice details
  const getEventForTicket = (eventId: string) => events.find(e => e.id === eventId);
  
  const totalPrice = cart.reduce((sum, t) => sum + t.priceSui, 0);

  const handleCheckoutClick = () => {
    setIsProcessing(true);
    onCheckout();
    // Simulate short delay then let global checkout flow handle success
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Side Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-brand-bg border-l-[4px] border-black shadow-[-16px_0px_0px_rgba(0,0,0,1)] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-brand-purple border-b-[4px] border-black flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3 text-white">
                <TicketIcon size={32} strokeWidth={3} />
                <h2 className="text-3xl font-black uppercase tracking-widest text-stroke-white" style={{ WebkitTextStroke: '1px black', textShadow: '2px 2px 0 #000'}}>Cart</h2>
              </div>
              <button 
                onClick={() => setCartOpen(false)}
                className="w-12 h-12 bg-white border-[4px] border-black flex items-center justify-center neo-btn rounded-none shadow-[4px_4px_0px_#000]"
              >
                <X strokeWidth={4} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-50">
                  <span className="text-6xl mb-4">🛒</span>
                  <p className="font-black text-2xl uppercase">Cart is Empty</p>
                </div>
              ) : (
                cart.map(ticket => {
                  const event = getEventForTicket(ticket.eventId);
                  return (
                    <motion.div 
                      key={ticket.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white border-[4px] border-black p-4 relative shadow-[6px_6px_0px_#000] rotate-[-1deg] group flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="pr-8">
                          <p className="font-extrabold text-xs uppercase text-gray-500 line-clamp-1">{event?.title}</p>
                          <h4 className="text-2xl font-black uppercase leading-none mt-1">{ticket.ticketClass}</h4>
                        </div>
                        <button 
                          onClick={() => removeFromCart(ticket.id)}
                          className="w-8 h-8 bg-[#ff5f56] border-[3px] border-black flex items-center justify-center neo-btn absolute top-4 right-4"
                        >
                          <Trash2 size={16} color="white" strokeWidth={3} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-end border-t-[3px] border-black border-dashed pt-3 mt-1">
                        <span className="font-mono text-sm font-bold tracking-widest uppercase">ID: {ticket.id}</span>
                        <span className="bg-brand-yellow px-3 py-1 border-[3px] border-black font-black text-lg shadow-[2px_2px_0px_#000]">
                          {ticket.priceSui} SUI
                        </span>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>

            {/* Footer Checkout */}
            <div className="p-6 bg-white border-t-[4px] border-black flex flex-col gap-4 shrink-0">
              <div className="flex justify-between items-center px-4 py-3 bg-brand-bg border-[3px] border-black shadow-[4px_4px_0px_#000]">
                <span className="font-black uppercase text-xl text-gray-600">Total</span>
                <span className="font-black text-3xl">{totalPrice} SUI</span>
              </div>
              
              <button
                disabled={cart.length === 0 || !isWalletConnected || isProcessing}
                onClick={handleCheckoutClick}
                className="w-full bg-black text-white px-6 py-4 border-[4px] border-black font-black text-2xl uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-brand-green transition-colors group shadow-[8px_8px_0px_rgba(0,0,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed active:translate-x-2 active:translate-y-2 active:shadow-none"
              >
                {!isWalletConnected ? 'Connect to Auto-buy' : 'Confirm Purchase'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
