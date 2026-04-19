import { useAppStore } from '../store';
import { ConnectModal, useSuiClientQuery } from '@mysten/dapp-kit';
import { Wallet, Loader2, Ticket as TicketIcon, Grid, User, Bell } from 'lucide-react';
export function Navbar() {
  const { isWalletConnected, walletAddress, userOwnedTickets, cart, setCartOpen, activePage, setActivePage } = useAppStore();
  const { data: balanceData } = useSuiClientQuery(
    'getBalance',
    { 
      owner: walletAddress!,
    },
    { enabled: !!walletAddress, refetchInterval: 10000 }
  );
  const suiCash = balanceData ? (Number(balanceData.totalBalance) / 1e9).toFixed(2) : '0.00';
  const portfolioSui = userOwnedTickets.reduce((sum, ticket) => sum + ticket.priceSui, 0).toFixed(2);
  return (
    <nav className="flex items-center justify-between p-6 border-b-[4px] border-black bg-brand-bg sticky top-0 z-40">
      <div className="flex items-center cursor-pointer ml-4 gap-3 group" onClick={() => setActivePage('landing')}>
        <div className="w-14 h-14 border-[3px] border-black bg-white shadow-[4px_4px_0px_#000] rounded-lg flex items-center justify-center overflow-hidden transition-transform group-hover:-rotate-3">
          <img
            src="/logo.jpg"
            alt="FairTicket Logo"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex items-center">
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
      </div>
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
      <div className="flex items-center gap-4">
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
        {isWalletConnected && (
          <button
            onClick={() => setActivePage('dashboard')}
            className={`hidden md:flex px-4 py-2 text-white border-[3px] border-black font-black text-sm items-center gap-2 neo-box cursor-pointer uppercase transition-colors ${activePage === 'dashboard' ? 'bg-black' : 'bg-brand-blue hover:bg-blue-600'}`}
          >
            <Grid size={18} />
            My Dashboard
          </button>
        )}
        {isWalletConnected ? (
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6 border-r-[2px] border-gray-300 pr-6">
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Portfolio</span>
                <span className="text-[17px] font-black text-brand-green whitespace-nowrap">{portfolioSui} SUI</span>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Cash</span>
                <span className="text-[17px] font-black text-blue-600 whitespace-nowrap">{suiCash} SUI</span>
              </div>
            </div>
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
                onClick={() => setActivePage('profile')}
                className={`w-[42px] h-[42px] rounded-full sm:ml-2 border-[3px] border-black shadow-[2px_2px_0px_#000] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer ${activePage === 'profile' ? 'bg-black text-white' : 'bg-gradient-to-br from-[#f8bb46] to-[#fc5d4c] text-white'}`}
              >
                <User size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ) : (
          <ConnectModal
            trigger={
              <button className="px-6 py-2.5 bg-white text-black border-[3px] border-black font-bold text-sm flex items-center gap-2 neo-btn uppercase hover:-translate-y-1 transition-transform">
                <Wallet size={18} />
                Connect Wallet &rarr;
              </button>
            }
          />
        )}
      </div>
    </nav>
  );
}
