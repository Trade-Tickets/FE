import type { Comment, Event, Ticket } from '../types';

const API_BASE_URL = (() => {
  const explicitUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  // If a non-empty URL is explicitly set, use it (production deployments)
  if (explicitUrl && explicitUrl.trim().length > 0) {
    return explicitUrl.replace(/\/$/, '');
  }
  // Default: empty string → relative URL → goes through Vite proxy in dev
  return '';
})();

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchEvents(page = 0, size = 6): Promise<Event[]> {
  return request<Event[]>(`/api/events?page=${page}&size=${size}`);
}

export async function fetchEventById(eventId: string): Promise<Event | null> {
  try {
    return await request<Event>(`/api/events/${eventId}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}

export async function fetchTicketsByEvent(eventId: string): Promise<Ticket[]> {
  return request<Ticket[]>(`/api/tickets?eventId=${encodeURIComponent(eventId)}`);
}

export async function fetchComments(eventId: string): Promise<Comment[]> {
  return request<Comment[]>(`/api/events/${eventId}/comments`);
}

export async function postComment(eventId: string, comment: Comment): Promise<Comment> {
  return request<Comment>(`/api/events/${eventId}/comments`, {
    method: 'POST',
    body: JSON.stringify(comment),
  });
}

export async function fetchFloorPrice(eventId: string, ticketClass: string): Promise<number> {
  const result = await request<{ floorPrice: number }>(
    `/api/market/floor-price?eventId=${encodeURIComponent(eventId)}&ticketClass=${encodeURIComponent(ticketClass)}`,
  );
  return result.floorPrice;
}

// ── Wallet / Trade History ─────────────────────────────────────────────────────

export interface TradeRecord {
  id: string;
  walletAddress: string;
  eventId: string;
  eventTitle: string;
  ticketClass: string;
  tradeType: 'buy' | 'sell';
  priceSui: number;
  quantity: number;
  totalCost: number;
  platformFee: number;
  sellTax: number;
  suiTxDigest: string | null;
  status: string;
  createdAt: string;
}

export interface WalletProfile {
  walletAddress: string;
  firstSeenAt: string;
  lastActiveAt: string;
  totalBuyVolume: number;
  totalSellVolume: number;
  totalTrades: number;
  recentTrades: TradeRecord[];
}

export async function fetchWalletProfile(walletAddress: string): Promise<WalletProfile> {
  return request<WalletProfile>(`/api/wallet/${encodeURIComponent(walletAddress)}`);
}

export async function fetchWalletTrades(walletAddress: string): Promise<TradeRecord[]> {
  return request<TradeRecord[]>(`/api/wallet/${encodeURIComponent(walletAddress)}/trades`);
}

export interface RecordTradePayload {
  walletAddress: string;
  eventId: string;
  eventTitle: string;
  ticketClass: string;
  tradeType: 'buy' | 'sell';
  priceSui: number;
  quantity: number;
  totalCost: number;
  platformFee: number;
  sellTax: number;
  suiTxDigest?: string;
  status: 'filled' | 'open' | 'cancelled';
}

export async function recordTrade(payload: RecordTradePayload): Promise<TradeRecord> {
  return request<TradeRecord>('/api/wallet/trades', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

