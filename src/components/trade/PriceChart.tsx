import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MarketStat } from '../../types';

interface PriceChartProps {
  eventTitle: string;
  selectedClass: string;
  currentStat: MarketStat | undefined;
  isProfit: boolean;
}

export function PriceChart({ eventTitle, selectedClass, currentStat, isProfit }: PriceChartProps) {
  const chartData = currentStat?.priceHistory || [];

  return (
    <div className="h-[45%] flex-shrink-0 p-6 relative border-b-[4px] border-black bg-white">
      <p className="absolute top-4 left-6 font-mono font-bold text-gray-400 z-10 text-lg opacity-50 uppercase tracking-widest">
        {eventTitle} - {selectedClass}
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isProfit ? '#22c55e' : '#ff5f56'} stopOpacity={0.4} />
              <stop offset="95%" stopColor={isProfit ? '#22c55e' : '#ff5f56'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
          <XAxis dataKey="time" tick={{ fontFamily: 'monospace', fontSize: 10, fill: '#000' }} axisLine={false} tickLine={false} dy={5} minTickGap={30} />
          <YAxis domain={['auto', 'auto']} tick={{ fontFamily: 'monospace', fontSize: 10, fill: '#000' }} axisLine={false} tickLine={false} orientation="right" dx={5} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '3px solid #000', borderRadius: '0', boxShadow: '4px 4px 0px #000', fontFamily: 'monospace', fontWeight: 'bold' }}
            itemStyle={{ color: '#000' }}
          />
          <Area type="monotone" dataKey="price" stroke={isProfit ? '#22c55e' : '#ff5f56'} strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
