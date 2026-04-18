import { create } from 'zustand';
import type { Ticket, Order, OrderStatus, NotificationItem } from './types';
import { PLATFORM_FEE_RATE, SELL_TAX_RATE } from './types';
import { fetchFloorPrice } from './api/mockApi';

interface AppState {
  notifications: NotificationItem[];
  addNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;

  // Navigation
  activePage: 'landing' | 'markets' | 'dashboard' | 'profile';
  setActivePage: (page: 'landing' | 'markets' | 'dashboard' | 'profile') => void;

  // Wallet State
  isWalletConnected: boolean;
  walletAddress: string | null;

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
  placeOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt' | 'expiresAt'>) => Promise<void>;
  cancelOrder: (orderId: string) => void;

  purchaseTickets: () => Promise<boolean>;

  checkExpiredOrders: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  notifications: [],
  addNotification: (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    set(state => ({
      notifications: [...state.notifications, { id, message, type }]
    }));
    setTimeout(() => {
      get().removeNotification(id);
    }, 3000);
  },
  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  activePage: 'landing',
  setActivePage: (page) => set({ activePage: page }),

  isWalletConnected: false,
  walletAddress: null,


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
    const floorPrice = await fetchFloorPrice(newOrder.eventId, newOrder.ticketClass);

    return new Promise((resolve) => {
      setTimeout(() => {
        const order: Order = {
          ...newOrder,
          id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: 'open',
          createdAt: Date.now(),
          expiresAt: Date.now() + 65000,
        };

        set((state) => {
          let updatedOrders = [order, ...state.orders];
          let updatedTickets = [...state.userOwnedTickets];

          const lowestAsk = floorPrice + 0.1;
          const highestBid = floorPrice - 0.2;

          // MATCHING LOGIC
          if (order.type === 'buy') {
            if (order.priceSui >= lowestAsk) {
              order.status = 'filled';

              // Fee calculation: Platform fee 0.1%
              const orderValue = order.priceSui * order.quantity;
              const platformFee = orderValue * PLATFORM_FEE_RATE;
              const totalCost = orderValue + platformFee;

              order.platformFee = platformFee;
              order.sellTax = 0;
              order.totalCost = totalCost;

              for (let i = 0; i < order.quantity; i++) {
                updatedTickets.push({
                  id: `TKT-MATCH-${Math.random().toString(36).substr(2, 5)}`,
                  eventId: order.eventId,
                  ticketClass: order.ticketClass,
                  priceSui: order.priceSui,
                  status: 'sold'
                });
              }
              get().addNotification(
                `✅ Buy Filled: ${orderValue.toFixed(2)} SUI + ${platformFee.toFixed(4)} fee = ${totalCost.toFixed(4)} SUI`,
                'success'
              );
            } else {
              order.status = 'open';
              get().addNotification(`Buy Order Placed on Order Book`, 'info');
            }
          } else if (order.type === 'sell') {
            // SELL always fills — any price is accepted
            order.status = 'filled';

            const ticketsOfClass = updatedTickets.filter(t => t.eventId === order.eventId && t.ticketClass === order.ticketClass);
            const totalSpend = ticketsOfClass.reduce((sum, t) => sum + t.priceSui, 0);
            const avgBuyPrice = ticketsOfClass.length > 0 ? totalSpend / ticketsOfClass.length : order.priceSui;
            order.avgBuyPrice = avgBuyPrice;

            // Fee calculation: Platform fee 0.1% + Sell tax 0.5%
            const orderValue = order.priceSui * order.quantity;
            const platformFee = orderValue * PLATFORM_FEE_RATE;
            const sellTax = orderValue * SELL_TAX_RATE;
            const netProceeds = orderValue - platformFee - sellTax;

            order.platformFee = platformFee;
            order.sellTax = sellTax;
            order.totalCost = netProceeds;

            let removedCount = 0;
            updatedTickets = updatedTickets.filter(t => {
              if (removedCount < order.quantity && t.eventId === order.eventId && t.ticketClass === order.ticketClass) {
                removedCount++;
                return false;
              }
              return true;
            });
            get().addNotification(
              `✅ Sell Filled @ ${order.priceSui} SUI — Net: ${netProceeds.toFixed(4)} SUI (fee: ${platformFee.toFixed(4)} + tax: ${sellTax.toFixed(4)})`,
              'success'
            );
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

  checkExpiredOrders: () => {
    set((state) => {
      const now = Date.now();
      let changed = false;
      const updatedOrders = state.orders.map(o => {
        if (o.status === 'open' && o.expiresAt && o.expiresAt < now) {
          changed = true;
          return { ...o, status: 'expired' as OrderStatus };
        }
        return o;
      });

      if (!changed) return state;
      return { orders: updatedOrders };
    });
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
