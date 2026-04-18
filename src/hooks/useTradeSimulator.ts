// ========================================
// useTradeSimulator - Per-transaction live market data
// Generates candle (OHLC) data and recent trades tick-by-tick
// ========================================

import { useEffect, useRef, useState, useCallback } from 'react';

export interface CandleData {
  time: string;      // HH:MM:SS
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isBullish: boolean;
}

export interface TradeTick {
  id: string;
  time: string;
  price: number;
  volume: number;
  side: 'B' | 'S'; // B = Buy, S = Sell
  priceChange: number; // change from prev trade
}

interface SimulatorState {
  candles: CandleData[];
  trades: TradeTick[];
  currentPrice: number;
  change24h: number; // percent change
  volume24h: number;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

function generateInitialCandles(basePrice: number, count: number = 60): CandleData[] {
  const candles: CandleData[] = [];
  let price = basePrice * (0.88 + Math.random() * 0.1); // start a bit lower
  const now = Date.now();

  for (let i = count; i >= 0; i--) {
    const ts = now - i * 4000; // ~4s per candle
    const volatility = basePrice * 0.015;
    const open = price;
    const move = (Math.random() - 0.48) * volatility;
    const close = Math.max(0.01, open + move);
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low  = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * 1800 + 100) * 10;

    candles.push({
      time: formatTime(new Date(ts)),
      timestamp: ts,
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low:  parseFloat(Math.max(0.01, low).toFixed(4)),
      close: parseFloat(close.toFixed(4)),
      volume,
      isBullish: close >= open,
    });

    price = close;
  }

  return candles;
}

function generateInitialTrades(basePrice: number, count: number = 30): TradeTick[] {
  const trades: TradeTick[] = [];
  let price = basePrice;
  const now = Date.now();

  for (let i = count; i >= 0; i--) {
    const ts = now - i * 3500;
    const volatility = basePrice * 0.012;
    const change = (Math.random() - 0.48) * volatility;
    price = Math.max(0.01, price + change);
    const side: 'B' | 'S' = Math.random() > 0.45 ? 'B' : 'S'; // B = Buy, S = Sell
    trades.push({
      id: `t-${ts}`,
      time: formatTime(new Date(ts)),
      price: parseFloat(price.toFixed(4)),
      volume: Math.floor(Math.random() * 18 + 1) * 100,
      side,
      priceChange: parseFloat(change.toFixed(4)),
    });
  }

  return trades;
}

export function useTradeSimulator(basePrice: number, active: boolean = true): SimulatorState {
  const [candles, setCandles] = useState<CandleData[]>(() => generateInitialCandles(basePrice));
  const [trades, setTrades] = useState<TradeTick[]>(() => generateInitialTrades(basePrice));
  const [currentPrice, setCurrentPrice] = useState(basePrice);
  const [change24h, setChange24h] = useState(() => {
    const r = (Math.random() * 6 - 2);
    return parseFloat(r.toFixed(2));
  });
  const [volume24h, setVolume24h] = useState(() => Math.floor(Math.random() * 90 + 10) * 100);

  const priceRef = useRef(currentPrice);
  priceRef.current = currentPrice;

  const openOf24h = useRef(basePrice);

  // Recalculate change when price changes
  const recalcChange = useCallback((newPrice: number) => {
    const pct = ((newPrice - openOf24h.current) / openOf24h.current) * 100;
    setChange24h(parseFloat(pct.toFixed(2)));
  }, []);

  useEffect(() => {
    if (!active) return;

    // Randomise interval between 1.5s–4s to feel natural
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const now = new Date();
      const ts = now.getTime();
      const volatility = priceRef.current * 0.018;

      // Bias slightly towards mean-reversion
      const drift = (basePrice - priceRef.current) * 0.03;
      const move = drift + (Math.random() - 0.50) * volatility;
      const newPrice = Math.max(0.01, parseFloat((priceRef.current + move).toFixed(4)));

      const isPriceUp = newPrice >= priceRef.current;
      // B = Buy, S = Sell
      const side: 'B' | 'S' = isPriceUp ? 'B' : 'S';
      const volume = Math.floor(Math.random() * 18 + 1) * 100;

      // New trade tick
      const trade: TradeTick = {
        id: `t-${ts}`,
        time: formatTime(now),
        price: newPrice,
        volume,
        side,
        priceChange: parseFloat((newPrice - priceRef.current).toFixed(4)),
      };

      // New candle (1 candle per trade — tick chart)
      const prevClose = priceRef.current;
      const high = Math.max(newPrice, prevClose) + Math.random() * volatility * 0.3;
      const low  = Math.min(newPrice, prevClose) - Math.random() * volatility * 0.3;

      const candle: CandleData = {
        time: formatTime(now),
        timestamp: ts,
        open: parseFloat(prevClose.toFixed(4)),
        high: parseFloat(high.toFixed(4)),
        low: parseFloat(Math.max(0.01, low).toFixed(4)),
        close: newPrice,
        volume,
        isBullish: newPrice >= prevClose,
      };

      setTrades(prev => [trade, ...prev].slice(0, 50));
      setCandles(prev => {
        const next = [...prev, candle];
        return next.length > 80 ? next.slice(next.length - 80) : next;
      });
      setCurrentPrice(newPrice);
      setVolume24h(prev => prev + volume);
      recalcChange(newPrice);

      // Schedule next tick with random interval
      const nextInterval = 1500 + Math.random() * 2500;
      timeoutId = setTimeout(tick, nextInterval);
    };

    // Start after a short delay
    timeoutId = setTimeout(tick, 800 + Math.random() * 1200);

    return () => clearTimeout(timeoutId);
  }, [active, basePrice, recalcChange]);

  return { candles, trades, currentPrice, change24h, volume24h };
}
