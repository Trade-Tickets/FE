// ========================================
// Centralized Type Definitions
// ========================================

// --- Ticket Types ---
export type TicketStatus = 'available' | 'sold' | 'listing';
export type TicketClass = 'VIP' | 'Regular' | 'Early Bird' | 'Online Standard' | 'In-Person Pass' | 'Hacker Pass' | 'Gallery Entry' | 'Investor Pass' | string;

export interface Ticket {
  id: string;
  eventId: string;
  ticketClass: TicketClass;
  priceSui: number;
  status: TicketStatus;
}

// --- Market Types ---
export interface MarketStat {
  ticketClass: TicketClass;
  originalPrice: number;
  floorPrice: number;
  change24h: number;
  volume24h: string;
  priceHistory: { time: string; price: number }[];
}

// --- Event Types ---
export interface Event {
  id: string;
  title: string;
  coverImage: string;
  location: string;
  date: string;
  time: string;
  description: string;
  about: string;
  lineup: string[];
  organizer: string;
  tags: string[];
  tradingStatus: "Live" | "Halted" | "Settled";
  settlementDate: string;
  marketStats: MarketStat[];
}

// --- Order Types ---
export type OrderType = 'buy' | 'sell';
export type OrderStatus = 'open' | 'filled' | 'cancelled' | 'expired';

// Fee constants
export const PLATFORM_FEE_RATE = 0.001; // 0.1%
export const SELL_TAX_RATE = 0.005;     // 0.5%

export interface Order {
  id: string;
  eventId: string;
  ticketClass: string;
  type: OrderType;
  priceSui: number;
  quantity: number;
  status: OrderStatus;
  createdAt: number;
  expiresAt: number;
  avgBuyPrice?: number;
  platformFee?: number;  // 0.1% on both buy/sell
  sellTax?: number;      // 0.5% on sell only
  totalCost?: number;    // total after fees
}

// --- Notification Types ---
export interface NotificationItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// --- Comment Types ---
export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}
