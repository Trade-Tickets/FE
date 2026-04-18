import { useAppStore } from '../store';
import { Navbar } from '../components/Navbar';
import { useDisconnectWallet, useSuiClientQuery } from '@mysten/dapp-kit';
import { LogOut } from 'lucide-react';

import { ProfileStats } from '../components/profile/ProfileStats';
import { ProfileChart } from '../components/profile/ProfileChart';
import { ProfileTradeHistory } from '../components/profile/ProfileTradeHistory';

export function ProfilePage() {
  const { walletAddress, userOwnedTickets, setActivePage } = useAppStore();
  const { mutate: disconnect } = useDisconnectWallet();

  const shortAddress = walletAddress 
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : '';

  const { data: balanceData } = useSuiClientQuery(
    'getBalance',
    { owner: walletAddress! },
    { enabled: !!walletAddress, refetchInterval: 10000 }
  );

  const suiCash = balanceData ? (Number(balanceData.totalBalance) / 1e9).toFixed(2) : '0.00';
  const portfolioSui = userOwnedTickets.reduce((sum, ticket) => sum + ticket.priceSui, 0).toFixed(2);
  const totalPnL = '+14.2%'; // Mock value from previous dropdown
  const isTotalProfit = true;

  const handleDisconnect = () => {
    disconnect();
    setActivePage('landing');
  };

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black mb-4 uppercase">Not Connected</h1>
        <button onClick={() => setActivePage('landing')} className="neo-btn bg-white px-6 py-3 font-bold border-[3px] border-black">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans selection:bg-black selection:text-white pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-[4px] border-black pb-6 mb-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mix-blend-hard-light mb-2">
              My Profile
            </h1>
            <p className="font-bold text-xl text-gray-600 bg-brand-green inline-block px-3 py-1 border-[2px] border-black shadow-[2px_2px_0px_#000]">
              Account &amp; Journey
            </p>
          </div>
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-2 px-6 py-3 bg-[#ff5f56] hover:bg-red-600 text-white font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all"
          >
            <LogOut size={20} strokeWidth={3} /> Disconnect Wallet
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <ProfileStats 
              walletAddress={walletAddress} 
              suiCash={suiCash} 
              portfolioSui={portfolioSui} 
              totalPnL={totalPnL} 
              isTotalProfit={isTotalProfit} 
            />

            {/* Trading Journey Chart */}
            <ProfileChart />
          </div>

          {/* Right Column: Activity / Settings */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <ProfileTradeHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
