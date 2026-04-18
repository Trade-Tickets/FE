import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store';
import { Wallet, Loader2, Ticket as TicketIcon, Grid, User, Bell } from 'lucide-react';
import { AccountDropdown } from './navbar/AccountDropdown';

export function Navbar() {
  const { isWalletConnected, walletAddress, connectWallet, cart, setCartOpen, activePage, setActivePage } = useAppStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

      {/* Navigation Links */}
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
        {isWalletConnected && (
          <button
            onClick={() => setActivePage('dashboard')}
            className={`hidden md:flex px-4 py-2 text-white border-[3px] border-black font-black text-sm items-center gap-2 neo-box cursor-pointer uppercase transition-colors ${activePage === 'dashboard' ? 'bg-black' : 'bg-brand-blue hover:bg-blue-600'}`}
          >
            <Grid size={18} />
            My Dashboard
          </button>
        )}

        {/* Connect Wallet / Account */}
        {isWalletConnected ? (
          <div className="flex items-center gap-6" ref={dropdownRef}>
            {/* Portfolio & Cash Stats */}
            <div className="hidden lg:flex items-center gap-6 border-r-[2px] border-gray-300 pr-6">
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Portfolio</span>
                <span className="text-[17px] font-black text-brand-green whitespace-nowrap">$120.50</span>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Cash (USDC)</span>
                <span className="text-[17px] font-black text-blue-600 whitespace-nowrap">$980.69 USDC</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-5 relative">
              <button
                onClick={() => useAppStore.getState().addNotification('Deposit modal opened', 'info')}
                className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-black text-sm uppercase rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_#000] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] transition-all"
              >
                Deposit
              </button>

              <button className="relative p-1 hover:opacity-70 transition-opacity">
                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white z-10"></div>
                <Bell size={26} strokeWidth={2.5} className="text-gray-700" />
              </button>

              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="w-[42px] h-[42px] rounded-full sm:ml-2 bg-gradient-to-br from-[#f8bb46] to-[#fc5d4c] border-[3px] border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer"
              >
                <User size={20} strokeWidth={2.5} />
              </button>

              {/* Account Dropdown */}
              {isAccountOpen && (
                <AccountDropdown walletAddress={walletAddress} onClose={() => setIsAccountOpen(false)} />
              )}
            </div>
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
