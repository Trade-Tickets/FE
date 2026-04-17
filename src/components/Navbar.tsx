import { useState } from 'react';
import { useAppStore } from '../store';
import { Wallet, Loader2, Ticket as TicketIcon, Grid } from 'lucide-react';

export function Navbar() {
  const { isWalletConnected, walletAddress, connectWallet, cart, setCartOpen, activePage, setActivePage } = useAppStore();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    await connectWallet();
    setIsConnecting(false);
  };

  return (
    <nav className="flex items-center justify-between p-6 border-b-[4px] border-black bg-brand-bg sticky top-0 z-40">
      {/* Logo */}
      <div className="flex items-center cursor-pointer ml-4" onClick={() => setActivePage('landing')}>
        <div className="w-8 h-8 bg-brand-green border-[3px] border-black flex items-center justify-center text-black font-black text-xl neo-box rotate-[-6deg]">
          F
        </div>
        <div className="w-8 h-8 bg-brand-yellow border-[3px] border-black flex items-center justify-center text-black font-black text-xl neo-box translate-y-2 z-10">
          A
        </div>
        <div className="w-8 h-8 bg-brand-purple border-[3px] border-black flex items-center justify-center text-black font-black text-xl neo-box rotate-[6deg] -ml-1">
          I
        </div>
        <div className="w-8 h-8 bg-brand-pink border-[3px] border-black flex items-center justify-center text-black font-black text-xl neo-box -ml-1">
          R
        </div>
        
        <div className="flex flex-col ml-3">
          <span className="text-3xl font-black uppercase leading-none tracking-tighter">TICKET</span>
          <div className="bg-black text-white text-[10px] font-bold px-2 py-0.5 transform -skew-x-[12deg] w-fit">
            APP DEVELOPER
          </div>
        </div>
      </div>

      {/* Navigation Links - Hidden on mobile for simplicity */}
      <div className="hidden lg:flex gap-8 font-bold text-sm tracking-widest text-black">
        <button 
          onClick={() => setActivePage('markets')}
          className={`hover:underline underline-offset-4 decoration-4 uppercase ${activePage === 'markets' ? 'underline' : ''}`}
        >
          Markets
        </button>
        {isWalletConnected && (
          <button 
            onClick={() => setActivePage('dashboard')}
            className={`hover:underline underline-offset-4 decoration-4 uppercase ${activePage === 'dashboard' ? 'underline' : ''}`}
          >
            Dashboard
          </button>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Cart Icon */}
        <div 
          onClick={() => setCartOpen(true)}
          className="relative p-2 bg-brand-yellow border-[3px] border-black neo-btn rounded-full cursor-pointer hover:bg-brand-yellow-dark transition-colors text-black"
        >
          <TicketIcon size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-3 -right-3 bg-brand-purple border-[2px] border-black text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-[2px_2px_0px_#000]">
              {cart.length}
            </span>
          )}
        </div>

        {/* Dashboard Button */}
        {isWalletConnected && ( // Optional secondary access to Dashboard
          <button
            onClick={() => setActivePage('dashboard')}
            className={`hidden md:flex px-4 py-2 text-white border-[3px] border-black font-black text-sm items-center gap-2 neo-box cursor-pointer uppercase transition-colors ${activePage === 'dashboard' ? 'bg-black' : 'bg-brand-blue hover:bg-blue-600'}`}
          >
            <Grid size={18} />
            My Dashboard
          </button>
        )}

        {/* Connect Wallet Button */}
        {isWalletConnected ? (
          <div className="px-5 py-2 bg-white border-[3px] border-black font-black text-sm flex items-center gap-2 neo-box uppercase">
            <div className="w-3 h-3 bg-brand-green border-[2px] border-black rounded-full animate-pulse"></div>
            {walletAddress}
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-6 py-2.5 bg-white text-black border-[3px] border-black font-bold text-sm flex items-center gap-2 neo-btn disabled:opacity-70 disabled:cursor-not-allowed uppercase hover:-translate-y-1 transition-transform"
          >
            {isConnecting ? <Loader2 className="animate-spin" size={18} /> : <Wallet size={18} />}
            {isConnecting ? 'Connecting...' : 'Connect Wallet \u2192'}
          </button>
        )}
      </div>
    </nav>
  );
}
