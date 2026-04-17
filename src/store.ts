import { create } from 'zustand';
import { Ticket } from './mockData';

export type OrderType = 'buy' | 'sell';
export type OrderStatus = 'open' | 'filled' | 'cancelled';

export interface Order {
  id: string;
  eventId: string;
  ticketClass: string;
  type: OrderType;
  priceSui: number;
  quantity: number;
  status: OrderStatus;
  createdAt: number;
}

interface AppState {
  // Navigation
  activePage: 'landing' | 'markets' | 'dashboard';
  setActivePage: (page: 'landing' | 'markets' | 'dashboard') => void;

  // Wallet State
  isWalletConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;

  // Cart State (legacy/quick-buy)
  cart: Ticket[];
  addToCart: (ticket: Ticket) => void;
  removeFromCart: (ticketId: string) => void;
  clearCart: () => void;

  // UI States
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isMyTicketsOpen: boolean;
  setMyTicketsOpen: (open: boolean) => void;

  // Owned Tickets & Orders
  userOwnedTickets: Ticket[];
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  cancelOrder: (orderId: string) => void;

  purchaseTickets: () => Promise<boolean>;
}

export const useAppStore = create<AppState>((set, get) => ({
  activePage: 'landing',
  setActivePage: (page) => set({ activePage: page }),

  isWalletConnected: false,
  walletAddress: null,
  
  connectWallet: async () => {
    // Simulate 1s loading
    return new Promise((resolve) => {
      setTimeout(() => {
        set({
          isWalletConnected: true,
          walletAddress: "0x7F5...c4B2" // Mock SUI address
        });
        resolve();
      }, 1000);
    });
  },

  disconnectWallet: () => {
    set({ isWalletConnected: false, walletAddress: null });
  },

  cart: [],
  
  addToCart: (ticket) => {
    set((state) => {
      if (state.cart.find(t => t.id === ticket.id)) return state;
      return { cart: [...state.cart, ticket], isCartOpen: true };
    });
  },

  removeFromCart: (ticketId) => {
    set((state) => ({
      cart: state.cart.filter(t => t.id !== ticketId)
    }));
  },

  clearCart: () => set({ cart: [] }),

  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  
  isMyTicketsOpen: false,
  setMyTicketsOpen: (open) => set({ isMyTicketsOpen: open }),

  userOwnedTickets: [],
  orders: [],

  placeOrder: async (newOrder) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const order: Order = {
          ...newOrder,
          id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: 'open',
          createdAt: Date.now()
        };

        set((state) => {
          let updatedOrders = [order, ...state.orders];
          let updatedTickets = [...state.userOwnedTickets];

          // Simulate auto-fill (instant match) for BUYS to demonstrate "Matched" status
          if (order.type === 'buy') {
            order.status = 'filled';
            // Actually give them tickets
            for (let i = 0; i < order.quantity; i++) {
              updatedTickets.push({
                id: `TKT-MATCH-${Math.random().toString(36).substr(2, 5)}`,
                eventId: order.eventId,
                ticketClass: order.ticketClass,
                priceSui: order.priceSui,
                status: 'sold'
              });
            }
          }

          return {
            orders: updatedOrders,
            userOwnedTickets: updatedTickets
          };
        });
        resolve();
      }, 800);
    });
  },

  cancelOrder: (orderId) => {
    set((state) => ({
      orders: state.orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o)
    }));
  },

  purchaseTickets: async () => {
    const { cart } = get();
    if (cart.length === 0) return false;

    return new Promise((resolve) => {
      setTimeout(() => {
        set((state) => ({
          userOwnedTickets: [...state.userOwnedTickets, ...state.cart],
          cart: [], 
          isCartOpen: false 
        }));
        resolve(true);
      }, 2000);
    });
  }
}));
