import { motion } from 'motion/react';
import { MOCK_EVENTS, Event } from '../mockData';
import { Calendar, MapPin, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useMemo } from 'react';

interface EventExplorerProps {
  onEventClick: (event: Event) => void;
}

const CATEGORIES = ["All", "Crypto", "Music", "Gaming", "Startup"];

export function EventExplorer({ onEventClick }: EventExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || 
                              event.tags.some(tag => tag.toUpperCase().includes(selectedCategory.toUpperCase()));
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Live Markets</h2>
          <div className="w-6 h-6 bg-brand-green rounded-full border-[3px] border-black animate-pulse shadow-[2px_2px_0px_#000]"></div>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-[350px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={24} strokeWidth={3} className="text-black" />
          </div>
          <input 
            type="text" 
            placeholder="Search events, locations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-[4px] border-black font-bold text-lg text-black placeholder:text-gray-500 shadow-[6px_6px_0px_#000] focus:outline-none focus:translate-y-1 focus:translate-x-1 focus:shadow-[2px_2px_0px_#000] transition-all"
          />
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="flex gap-4 mb-10 flex-wrap">
        {CATEGORIES.map(category => (
          <button 
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 font-bold border-[3px] border-black neo-btn rounded-md uppercase tracking-tight ${
              selectedCategory === category 
              ? 'bg-brand-blue text-white shadow-[0px_0px_0px_#000] translate-y-1 translate-x-1' 
              : 'bg-white text-black'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredEvents.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center bg-white border-[4px] border-black shadow-[8px_8px_0px_#000]">
          <div className="text-6xl mb-4">🤷</div>
          <h3 className="text-2xl font-black uppercase">No Markets Found</h3>
          <p className="font-bold text-gray-500">Try adjusting your search or category filters.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            className="mt-6 px-6 py-2 bg-brand-yellow font-bold border-[3px] border-black select-none neo-btn"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onClick={() => onEventClick(event)} />
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ event, onClick }: { event: Event; onClick: () => void; key?: string | number }) {
  const topStat = event.marketStats?.[0]; // Show the primary market stat
  const statusColor = event.tradingStatus === 'Live' ? 'bg-brand-green' : 'bg-gray-400';

  return (
    <motion.div
      whileHover={{ y: -4, x: -4, boxShadow: "12px 12px 0px #000" }}
      whileTap={{ scale: 0.98, boxShadow: "0px 0px 0px #000", x: 4, y: 4 }}
      onClick={onClick}
      className="bg-white border-[4px] border-black rounded-[16px] overflow-hidden cursor-pointer relative group transition-all duration-100 flex flex-col shadow-[8px_8px_0px_#000] h-full"
    >
      
      {/* Cover Image & Tags */}
      <div className="h-[180px] relative overflow-hidden bg-gray-200 border-b-[4px] border-black shrink-0">
        <div className="absolute top-3 left-3 flex gap-2 z-10 flex-wrap">
           <span className={`px-3 py-1 ${statusColor} border-[3px] border-black text-black rounded text-xs font-black uppercase shadow-[2px_2px_0px_#000]`}>
             {event.tradingStatus}
           </span>
        </div>
        <img 
          src={event.coverImage} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        
        <h3 className="text-2xl font-black mb-2 line-clamp-2 leading-tight uppercase">{event.title}</h3>
        <p className="text-gray-600 font-bold text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="mt-auto flex flex-col gap-2 text-sm font-bold text-gray-800 mb-6 border-t-[3px] border-black border-dashed pt-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} strokeWidth={2.5} className="text-brand-purple" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} strokeWidth={2.5} className="text-brand-green" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </div>

      {/* Market Stats Bar */}
      <div className="flex border-t-[4px] border-black bg-brand-bg relative z-10 shrink-0">
        <div className="w-1/2 p-4 border-r-[4px] border-black flex flex-col justify-center">
           <p className="font-extrabold text-[10px] text-gray-500 tracking-widest uppercase mb-1">
             {topStat ? `Floor (${topStat.ticketClass})` : 'Floor'}
           </p>
           <p className="font-black text-xl font-mono relative w-fit">
             {topStat ? `${topStat.floorPrice} SUI` : '--'}
           </p>
        </div>
        <div className={`w-1/2 p-4 flex flex-col justify-center ${topStat && topStat.change24h >= 0 ? 'bg-brand-green/20' : 'bg-[#ff5f56]/20'}`}>
           <p className="font-extrabold text-[10px] text-gray-500 tracking-widest uppercase mb-1">24H Change</p>
           <div className="flex items-center gap-1">
             {topStat ? (
               <>
                 {topStat.change24h >= 0 ? <TrendingUp size={18} className="text-green-700" strokeWidth={3}/> : <TrendingDown size={18} className="text-red-700" strokeWidth={3}/>}
                 <p className={`font-black text-lg font-mono ${topStat.change24h >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                   {topStat.change24h > 0 ? '+' : ''}{topStat.change24h}%
                 </p>
               </>
             ) : (
               <p className="font-black text-lg font-mono text-gray-400">---</p>
             )}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
