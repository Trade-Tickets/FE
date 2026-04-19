import { User, Coins, TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight, BarChart2 } from 'lucide-react';

interface ProfileStatsProps {
  walletAddress: string;
  suiCash: string;
  portfolioSui: string;
  totalPnL: string;
  isTotalProfit: boolean;

  totalTrades?: number;
  totalBuyVolume?: number;
  totalSellVolume?: number;
}

export function ProfileStats({
  walletAddress,
  suiCash,
  portfolioSui,
  totalPnL,
  isTotalProfit,
  totalTrades = 0,
  totalBuyVolume = 0,
  totalSellVolume = 0,
}: ProfileStatsProps) {
  const shortAddress = walletAddress
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : '';

  return (
    <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] p-6">
            <div className="flex items-center gap-3 mb-6 border-b-[4px] border-black pb-4">
        <div className="w-12 h-12 rounded-full bg-brand-purple border-[3px] border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
          <User size={24} className="text-white" />
        </div>
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-gray-500">Wallet Address</div>
          <div className="font-mono font-bold text-lg" title={walletAddress}>{shortAddress}</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
                <div className="bg-blue-50 border-[3px] border-black p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-black uppercase text-sm">
            <Coins size={18} /> Cash Balance
          </div>
          <span className="font-mono font-black text-xl">{suiCash} SUI</span>
        </div>

                <div className="bg-green-50 border-[3px] border-black p-4 flex justify-between items-center">
          <div className="flex flex-col gap-0.5">
            <span className="font-black uppercase text-sm">Portfolio</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Estimated Value</span>
          </div>
          <span className="font-mono font-black text-xl text-brand-green">{portfolioSui} SUI</span>
        </div>

                <div className={`border-[3px] border-black p-4 flex justify-between items-center ${isTotalProfit ? 'bg-[#dcfce7]' : 'bg-[#fee2e2]'}`}>
          <span className="font-black uppercase text-sm">Total PnL</span>
          <div className="flex items-center gap-2">
            <span className={`font-mono font-black text-xl ${isTotalProfit ? 'text-green-600' : 'text-red-600'}`}>
              {totalPnL}
            </span>
            {isTotalProfit ? <TrendingUp size={20} className="text-green-600" /> : <TrendingDown size={20} className="text-red-600" />}
          </div>
        </div>

                <div className="border-t-[3px] border-black border-dashed pt-3 mt-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Trade Statistics (BE)</p>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-xs font-bold text-gray-600 uppercase">
                <BarChart2 size={14} /> Total Orders
              </div>
              <span className="font-mono font-black text-base">{totalTrades}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-xs font-bold text-green-700 uppercase">
                <ArrowDownLeft size={14} /> Bought
              </div>
              <span className="font-mono font-black text-sm text-green-700">{totalBuyVolume.toFixed(4)} SUI</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-xs font-bold text-red-600 uppercase">
                <ArrowUpRight size={14} /> Sold
              </div>
              <span className="font-mono font-black text-sm text-red-600">{totalSellVolume.toFixed(4)} SUI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
