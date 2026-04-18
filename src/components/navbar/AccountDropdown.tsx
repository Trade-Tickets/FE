import { LogOut, User, Coins } from 'lucide-react';
import { useAppStore } from '../../store';

interface AccountDropdownProps {
  walletAddress: string | null;
  onClose: () => void;
}

export function AccountDropdown({ walletAddress, onClose }: AccountDropdownProps) {
  const { disconnectWallet } = useAppStore();

  return (
    <div className="absolute right-0 top-[130%] w-[280px] bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="p-4 border-b-[4px] border-black bg-brand-bg">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 font-black uppercase text-gray-500 text-xs">
            <User size={14} /> My Account
          </div>
          <span className="px-2 py-0.5 bg-brand-green border-[2px] border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_#000]">Live</span>
        </div>
        <p className="font-mono font-bold text-lg">{walletAddress}</p>
      </div>

      {/* Balance & PnL */}
      <div className="p-4 flex flex-col gap-3 border-b-[4px] border-black bg-white">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-600 text-xs uppercase flex items-center gap-1">
            <Coins size={14} /> Balance
          </span>
          <span className="font-black font-mono text-base">1,500 SUI</span>
        </div>
        <div className="flex justify-between items-center text-green-600">
          <span className="font-bold text-xs uppercase flex items-center gap-1">
            Total PnL
          </span>
          <span className="font-black font-mono text-base">+14.2% 🚀</span>
        </div>

        {/* Mini Sparkline Chart */}
        <div className="mt-2 flex flex-col gap-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trading Journey (30D)</span>
          <div className="w-full h-16 border-[2px] border-black bg-[#f0f9ff] relative overflow-hidden shadow-[2px_2px_0px_#000]">
            <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M 0 30 L 0 25 L 10 22 L 20 28 L 30 20 L 40 24 L 50 15 L 60 12 L 70 18 L 80 8 L 90 10 L 100 2 L 100 30 Z"
                fill="#22c55e" fillOpacity="0.2"
              />
              <path
                d="M 0 25 L 10 22 L 20 28 L 30 20 L 40 24 L 50 15 L 60 12 L 70 18 L 80 8 L 90 10 L 100 2"
                fill="none" stroke="#22c55e" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"
              />
              <circle cx="100" cy="2" r="3" fill="white" stroke="#22c55e" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col bg-white">
        <button className="flex items-center gap-3 w-full p-3 border-b-[4px] border-black hover:bg-gray-100 font-bold text-xs text-gray-700 transition-colors text-left uppercase">
          <span>📊 Trade History</span>
        </button>
        <button className="flex items-center gap-3 w-full p-3 border-b-[4px] border-black hover:bg-gray-100 font-bold text-xs text-gray-700 transition-colors text-left uppercase">
          <span>⚙️ Preferences</span>
        </button>
      </div>

      {/* Disconnect */}
      <button
        onClick={() => {
          disconnectWallet();
          onClose();
        }}
        className="w-full p-4 bg-[#ff5f56] text-white font-black uppercase text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut size={18} strokeWidth={3} /> Disconnect Wallet
      </button>
    </div>
  );
}
