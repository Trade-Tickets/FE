import { motion } from 'motion/react';
import { X, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { useAppStore } from '../store';
import { useState } from 'react';
import type { Event } from '../types';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { useSuiTrade } from '../hooks/useSuiTrade';

// Sub-components
import { PriceChart } from './trade/PriceChart';
import { OrderBook } from './trade/OrderBook';
import { RecentTrades } from './trade/RecentTrades';
import { TradeForm } from './trade/TradeForm';

interface TicketModalProps {
  event: Event | null;
  onClose: () => void;
  onPurchaseComplete: () => void;
}

export function TicketModal({ event, onClose, onPurchaseComplete }: TicketModalProps) {
  const { isWalletConnected, walletAddress, placeOrder, orders, addNotification } = useAppStore();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const { executeBuyOnChain, executeSellOnChain } = useSuiTrade();

  const { data: balanceData } = useSuiClientQuery(
    'getBalance',
    { owner: walletAddress! },
    { enabled: !!walletAddress, refetchInterval: 5000 }
  );
  const suiBalance = balanceData ? (Number(balanceData.totalBalance) / 1e9).toFixed(4) : '0.0000';

  if (!event) return null;

  const [selectedClass, setSelectedClass] = useState<string>(event.marketStats?.[0]?.ticketClass || 'VIP');

  const currentStat = event.marketStats?.find(s => s.ticketClass === selectedClass) || event.marketStats?.[0];
  const isProfit = (currentStat?.change24h || 0) >= 0;

  const handleExecuteTrade = async (qty: number, price: number) => {
    if (!isWalletConnected || !walletAddress) return;

    const floorPrice = currentStat?.floorPrice || price;
    const lowestAsk = floorPrice + 0.1;

    // BUY: fills only if price >= lowestAsk
    // SELL: ALWAYS fills at any price
    const willFill = activeTab === 'sell' ? true : price >= lowestAsk;

    if (willFill) {
      try {
        addNotification('⏳ Waiting for wallet signature...', 'info');

        let txResult;
        if (activeTab === 'buy') {
          // Buy: send full cost (orderValue + 0.1% fee) on-chain
          txResult = await executeBuyOnChain(walletAddress, price, qty);
          addNotification(
            `✅ Buy TX: ${txResult.txDigest.slice(0, 10)}... | -${txResult.netAmount.toFixed(4)} SUI`,
            'success'
          );
        } else {
          // Sell: send fees+tax on-chain (platform deducts, net proceeds returned later)
          txResult = await executeSellOnChain(walletAddress, price, qty);
          addNotification(
            `✅ Sell TX: ${txResult.txDigest.slice(0, 10)}... | Fee+Tax: -${txResult.amountSpent.toFixed(4)} SUI`,
            'success'
          );
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        if (errMsg.toLowerCase().includes('rejected') || errMsg.toLowerCase().includes('cancel') || errMsg.toLowerCase().includes('denied')) {
          addNotification('❌ Transaction rejected by user', 'error');
          return; // Stop completely if user rejected
        }
        // Network / gas error — warn but continue so local state still updates
        addNotification(`⚠️ On-chain TX error (${errMsg.slice(0, 50)})`, 'error');
      }
    }

    // Update local portfolio state
    await placeOrder({
      eventId: event.id,
      ticketClass: selectedClass,
      type: activeTab,
      priceSui: price,
      quantity: qty,
    });

    onPurchaseComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-7xl bg-brand-bg border-[4px] border-black shadow-[16px_16px_0px_#000] overflow-hidden flex flex-col h-[90vh] relative"
      >
        {/* Header */}
        <div className="bg-brand-yellow flex flex-col md:flex-row justify-between items-start md:items-center relative z-20 shrink-0 border-b-[4px] border-black">
          <div className="flex w-full md:w-auto h-full">
            <div className="p-4 md:p-6 border-r-[4px] border-black flex flex-col justify-center bg-white w-full md:w-auto">
              <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                <Activity strokeWidth={3} className="text-brand-purple" /> Trade Terminal
              </h2>
              <div className="flex gap-2 items-center mt-2">
                <p className="bg-white border-[2px] border-black px-2 py-0.5 font-bold text-sm shadow-[2px_2px_0px_#000]">
                  {event.title}
                </p>
              </div>
            </div>

            {/* Stat Overview */}
            <div className="p-4 md:p-6 hidden md:flex gap-8 items-center">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Index Price</p>
                <p className="text-3xl font-black font-mono">{currentStat?.floorPrice} SUI</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">24H Change</p>
                <div className="flex items-center gap-1 font-mono">
                  {isProfit ? <TrendingUp size={20} className="text-green-600" /> : <TrendingDown size={20} className="text-red-500" />}
                  <p className={`text-xl font-bold ${isProfit ? 'text-green-600' : 'text-red-500'}`}>
                    {isProfit ? '+' : ''}{currentStat?.change24h}%
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">24H Vol</p>
                <p className="text-xl font-bold font-mono">{currentStat?.volume24h}</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:static md:m-4 w-12 h-12 bg-white border-[4px] border-black flex items-center justify-center hover:bg-black hover:text-white transition-all text-black shadow-[4px_4px_0px_#000]"
          >
            <X strokeWidth={4} />
          </button>
        </div>

        {/* Trading Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white">

          {/* Left Column: Chart + OrderBook + Trades */}
          <div className="w-full lg:w-2/3 flex flex-col border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black shrink-0 relative overflow-hidden bg-brand-bg">
            {/* Asset Selectors */}
            <div className="flex border-b-[4px] border-black bg-white overflow-x-auto custom-scrollbar">
              {event.marketStats?.map(stat => (
                <button
                  key={stat.ticketClass}
                  onClick={() => setSelectedClass(stat.ticketClass)}
                  className={`px-8 py-4 font-black uppercase text-sm border-r-[4px] border-black transition-colors whitespace-nowrap ${selectedClass === stat.ticketClass ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  {stat.ticketClass} Asset
                </button>
              ))}
            </div>

            {/* Chart */}
            <PriceChart eventTitle={event.title} selectedClass={selectedClass} currentStat={currentStat} isProfit={isProfit} />

            {/* OrderBook + Recent Trades */}
            <div className="flex-1 flex text-xs font-mono font-bold overflow-hidden">
              <OrderBook eventId={event.id} selectedClass={selectedClass} currentStat={currentStat} orders={orders} isProfit={isProfit} />
              <RecentTrades currentStat={currentStat} />
            </div>
          </div>

          {/* Right Column: Trade Form */}
          <TradeForm
            isWalletConnected={isWalletConnected}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onExecuteTrade={handleExecuteTrade}
            defaultPrice={currentStat?.floorPrice || 50}
            suiBalance={suiBalance}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
