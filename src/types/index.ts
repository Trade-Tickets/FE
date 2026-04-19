
export type TicketStatus = 'available' | 'sold' | 'listing';
export type TicketClass = 'VIP' | 'Regular' | 'Early Bird' | 'Online Standard' | 'In-Person Pass' | 'Hacker Pass' | 'Gallery Entry' | 'Investor Pass' | string;

export interface Ticket {
  id: string;
  eventId: string;
  ticketClass: TicketClass;
  priceSui: number;
  status: TicketStatus;
}

export interface MarketStat {
  ticketClass: TicketClass;
  originalPrice: number;
  floorPrice: number;
  change24h: number;
  volume24h: string;
  priceHistory: { time: string; price: number }[];
}

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

export type OrderType = 'buy' | 'sell';
export type OrderStatus = 'open' | 'filled' | 'cancelled' | 'expired';

export const PLATFORM_FEE_RATE = 0.001;
export const SELL_TAX_RATE = 0.005;

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
  platformFee?: number;
  sellTax?: number;
  totalCost?: number;
}

export interface NotificationItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}
