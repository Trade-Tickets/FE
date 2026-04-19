import { useMemo, useRef, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { CandleData } from '../../hooks/useTradeSimulator';

interface PriceChartProps {
  eventTitle: string;
  selectedClass: string;
  candles: CandleData[];
  currentPrice: number;
  isProfit: boolean;
}

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; payload: { time: string; price: number; volume: number } }[];
}

function LineTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const val = payload[0].value;
  return (
    <div style={{
      background: '#fff',
      border: '3px solid #000',
      boxShadow: '4px 4px 0 #000',
      padding: '8px 12px',
      fontFamily: 'monospace',
      fontWeight: 'bold',
      fontSize: 11,
      minWidth: 140,
    }}>
      <div style={{ color: '#888', fontSize: 10, marginBottom: 4, letterSpacing: 1 }}>{d.time}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ color: '#555' }}>Price</span>
        <span style={{ color: val >= 0 ? '#16a34a' : '#dc2626', fontWeight: 900 }}>{val?.toFixed(4)} SUI</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ color: '#555' }}>Vol</span>
        <span>{d.volume?.toLocaleString()}</span>
      </div>
    </div>
  );
}

interface DotProps {
  cx?: number;
  cy?: number;
  index?: number;
  dataLength?: number;
  color: string;
}

function ActiveDot({ cx = 0, cy = 0, color }: DotProps) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={9} fill={color} fillOpacity={0.25} />
    </g>
  );
}

export function PriceChart({ eventTitle, selectedClass, candles, currentPrice, isProfit }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const color = isProfit ? '#22c55e' : '#ef4444';
  const colorDark = isProfit ? '#16a34a' : '#dc2626';

  const chartData = useMemo(() =>
    candles.map(c => ({
      time: c.time,
      price: c.close,
      volume: c.volume,
    }))
  , [candles]);

  const prices = chartData.map(d => d.price);
  const minP = Math.min(...prices, currentPrice);
  const maxP = Math.max(...prices, currentPrice);
  const pad = (maxP - minP) * 0.12 || 0.05;

  useEffect(() => {
    const el = containerRef.current?.querySelector('.recharts-wrapper');
    if (el) el.scrollLeft = el.scrollWidth;
  }, [chartData.length]);

  return (
    <div ref={containerRef} className="h-[45%] flex-shrink-0 p-4 relative border-b-[4px] border-black bg-white">
            <p className="absolute top-3 left-5 font-mono font-bold text-gray-400 z-10 text-sm opacity-60 uppercase tracking-widest pointer-events-none">
        {eventTitle} · {selectedClass}
      </p>

            <div
        className="absolute top-3 right-6 z-10 px-2 py-0.5 border-[2px] border-black font-mono font-black text-sm shadow-[2px_2px_0_#000]"
        style={{ backgroundColor: color, color: isProfit ? '#000' : '#fff' }}
      >
        {currentPrice.toFixed(4)} SUI
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 28, right: 72, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="60%" stopColor={color} stopOpacity={0.08} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="time"
            tick={{ fontFamily: 'monospace', fontSize: 9, fill: '#888' }}
            axisLine={false}
            tickLine={false}
            dy={4}
            interval="preserveStartEnd"
            minTickGap={50}
          />

          <YAxis
            domain={[minP - pad, maxP + pad]}
            tick={{ fontFamily: 'monospace', fontSize: 9, fill: '#888' }}
            axisLine={false}
            tickLine={false}
            orientation="right"
            dx={5}
            tickFormatter={(v: number) => v.toFixed(3)}
            width={60}
          />

          <Tooltip content={<LineTooltip />} cursor={{ stroke: '#00000033', strokeWidth: 1, strokeDasharray: '4 3' }} />

                    <ReferenceLine
            y={currentPrice}
            stroke={colorDark}
            strokeDasharray="5 3"
            strokeWidth={1.5}
            strokeOpacity={0.7}
          />

                    <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2.5}
            fill="url(#priceGradient)"
            fillOpacity={1}
            dot={false}
            activeDot={<ActiveDot color={color} />}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
