import { motion } from 'motion/react';
import { Event, MOCK_TICKETS } from '../mockData';
import { X, Check, Activity, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';
import { useAppStore } from '../store';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TicketModalProps {
  event: Event | null;
  onClose: () => void;
  onPurchaseComplete: () => void;
}

export function TicketModal({ event, onClose, onPurchaseComplete }: TicketModalProps) {
  const { cart, addToCart, removeFromCart, isWalletConnected, placeOrder } = useAppStore();
  const [activeTab, setActiveTab] = useState<'buy'|'sell'>('buy');
  const [orderQty, setOrderQty] = useState<number>(1);
  const [orderPrice, setOrderPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!event) return null;
  // Use the first ticket class by default for the chart
  const [selectedClass, setSelectedClass] = useState<string>(event.marketStats?.[0]?.ticketClass || 'VIP');

  // Pre-fill price when changing class
  useState(() => {
    const stat = event.marketStats?.[0];
    if (stat) setOrderPrice(stat.floorPrice);
  });

  const eventTickets = MOCK_TICKETS.filter(t => t.eventId === event.id);
  const ticketsToDisplay = eventTickets.filter(t => t.ticketClass === selectedClass);
  
  const currentStat = event.marketStats?.find(s => s.ticketClass === selectedClass) || event.marketStats?.[0];
  const chartData = currentStat?.priceHistory || [];

  const handleExecuteTrade = async () => {
    if (!isWalletConnected) return;

    setIsSubmitting(true);
    await placeOrder({
      eventId: event.id,
      ticketClass: selectedClass,
      type: activeTab,
      priceSui: orderPrice,
      quantity: orderQty,
    });
    setIsSubmitting(false);
    onPurchaseComplete();
  };
  
  const isProfit = (currentStat?.change24h || 0) >= 0;

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
                  
                  {/* Current Stat Overview inside Header */}
                  <div className="p-4 md:p-6 hidden md:flex gap-8 items-center">
                     <div>
                       <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Index Price</p>
                       <p className="text-3xl font-black font-mono">{currentStat?.floorPrice} SUI</p>
                     </div>
                     <div>
                       <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">24H Change</p>
                       <div className="flex items-center gap-1 font-mono">
                         {isProfit ? <TrendingUp size={20} className="text-green-600" /> : <TrendingDown size={20} className="text-red-500"/>}
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
              
              {/* Left Column: Chart Area */}
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
                
                {/* Recharts Canvas */}
                <div className="flex-1 p-6 relative">
                    <p className="absolute top-8 left-8 font-mono font-bold text-gray-400 z-10 text-xl opacity-50 uppercase tracking-widest">{event.title} - {selectedClass}</p>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={isProfit ? '#22c55e' : '#ff5f56'} stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor={isProfit ? '#22c55e' : '#ff5f56'} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                            <XAxis dataKey="time" tick={{fontFamily: 'monospace', fontSize: 12, fill: '#000'}} axisLine={false} tickLine={false} dy={10} minTickGap={30} />
                            <YAxis domain={['auto', 'auto']} tick={{fontFamily: 'monospace', fontSize: 12, fill: '#000'}} axisLine={false} tickLine={false} orientation="right" dx={10} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '3px solid #000', borderRadius: '0', boxShadow: '4px 4px 0px #000', fontFamily: 'monospace', fontWeight: 'bold' }}
                                itemStyle={{ color: '#000' }}
                            />
                            <Area type="monotone" dataKey="price" stroke={isProfit ? '#22c55e' : '#ff5f56'} strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
              </div>

                 {/* Right Column: Execution */}
              <div className="w-full lg:w-1/3 flex flex-col bg-white overflow-hidden relative">
                 {/* Tabs */}
                 <div className="flex border-b-[4px] border-black shrink-0 relative z-10">
                   <button 
                     onClick={() => setActiveTab('buy')}
                     className={`flex-1 py-4 font-black uppercase text-xl transition-colors border-r-[4px] border-black ${activeTab === 'buy' ? 'bg-brand-green text-black' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
                   >
                     Buy
                   </button>
                   <button 
                     onClick={() => setActiveTab('sell')}
                     className={`flex-1 py-4 font-black uppercase text-xl transition-colors ${activeTab === 'sell' ? 'bg-[#ff5f56] text-white' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
                   >
                     Sell
                   </button>
                 </div>

                 {/* Order Form */}
                 <div className="flex-1 overflow-y-auto p-6 bg-brand-bg relative custom-scrollbar flex flex-col gap-6">
                    <div className="flex justify-between items-center bg-white border-[3px] border-black p-3 shadow-[4px_4px_0px_#000]">
                       <span className="font-bold text-gray-500 uppercase text-xs tracking-widest">Available Balance</span>
                       <span className="font-mono font-black">{isWalletConnected ? '1,500.0 SUI' : '0.0 SUI'}</span>
                    </div>

                    <div className="flex flex-col gap-4">
                       <div className="flex flex-col gap-2">
                         <label className="font-bold text-sm uppercase tracking-widest text-gray-600">Quantity (Tickets)</label>
                         <div className="flex bg-white border-[3px] border-black h-12 shadow-[4px_4px_0px_#000]">
                            <button 
                               onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                               className="w-12 border-r-[3px] border-black font-black text-xl hover:bg-gray-200 active:bg-gray-300"
                            >-</button>
                            <input 
                               type="number" 
                               value={orderQty}
                               onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                               className="flex-1 text-center font-mono font-black text-xl outline-none min-w-0"
                            />
                            <button 
                               onClick={() => setOrderQty(orderQty + 1)}
                               className="w-12 border-l-[3px] border-black font-black text-xl hover:bg-gray-200 active:bg-gray-300"
                            >+</button>
                         </div>
                       </div>
                       
                       <div className="flex flex-col gap-2">
                         <label className="font-bold text-sm uppercase tracking-widest text-gray-600">Limit Price (SUI)</label>
                         <div className="flex bg-white border-[3px] border-black h-12 shadow-[4px_4px_0px_#000]">
                            <button 
                               onClick={() => setOrderPrice(Math.max(1, orderPrice - 1))}
                               className="w-12 border-r-[3px] border-black font-black text-xl hover:bg-gray-200 active:bg-gray-300"
                            >-</button>
                            <input 
                               type="number" 
                               value={orderPrice}
                               onChange={(e) => setOrderPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                               className="flex-1 text-center font-mono font-black text-xl outline-none min-w-0"
                            />
                            <button 
                               onClick={() => setOrderPrice(orderPrice + 1)}
                               className="w-12 border-l-[3px] border-black font-black text-xl hover:bg-gray-200 active:bg-gray-300"
                            >+</button>
                         </div>
                       </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t-[4px] border-black border-dashed pt-4 mt-auto">
                       <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-gray-500 uppercase tracking-widest">Order Value</span>
                          <span className="font-mono text-lg">{(orderQty * orderPrice).toFixed(2)} SUI</span>
                       </div>
                       <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-gray-500 uppercase tracking-widest">Est. Fee (1.5%)</span>
                          <span className="font-mono text-gray-500">{((orderQty * orderPrice) * 0.015).toFixed(4)} SUI</span>
                       </div>
                    </div>
                 </div>

                 {/* Action Button */}
                 <div className="p-6 border-t-[4px] border-black bg-white shrink-0 z-20">
                    <button
                      disabled={!isWalletConnected || isSubmitting}
                      onClick={handleExecuteTrade}
                      className={`w-full py-4 text-white border-[4px] border-black text-xl font-black uppercase tracking-widest shadow-[8px_8px_0px_#000] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group active:translate-x-2 active:translate-y-2 active:shadow-none ${
                        activeTab === 'buy' ? 'bg-brand-green hover:bg-green-600 text-black' : 'bg-[#ff5f56] hover:bg-red-600 text-white'
                      }`}
                    >
                      {!isWalletConnected ? 'Connect to Trade' : isSubmitting ? 'Processing...' : (activeTab === 'buy' ? 'Place Buy Order' : 'Place Sell Order')}
                    </button>
                    {isSubmitting && (
                       <p className="text-center font-bold text-xs uppercase text-gray-500 mt-3 animate-pulse">Confirming transaction on SUI network...</p>
                    )}
                 </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
  );
}
