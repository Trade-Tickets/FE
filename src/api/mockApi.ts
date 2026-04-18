// ========================================
// Mock API Service
// Simulates REST API calls with fetch-like async pattern.
// When the real BE is ready, replace the body of each function
// with actual fetch() calls — the signatures stay the same.
// ========================================

import type { Event, Ticket, Comment } from '../types';

// --- Helper: generate fake price history ---
const generateHistory = (basePrice: number, volatility: number, trend: 'up' | 'down' | 'flat', dataPoints = 24) => {
  let currentPrice = basePrice;
  const history = [];
  const now = new Date();

  for (let i = dataPoints; i >= 0; i--) {
    const randomShift = (Math.random() - 0.5) * volatility;
    let trendShift = 0;
    if (trend === 'up') trendShift = volatility * 0.2;
    if (trend === 'down') trendShift = -volatility * 0.2;

    currentPrice += randomShift + trendShift;
    if (currentPrice < 1) currentPrice = 1;

    const timePoint = new Date(now.getTime() - (i * 60 * 60 * 1000));
    history.push({
      time: timePoint.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: Number(currentPrice.toFixed(2))
    });
  }
  return history;
};

// --- Raw mock data (private to this module) ---
const EVENTS_DATA: Event[] = [
  {
    id: "evt_1",
    title: "Sui Builder House & Hackathon",
    coverImage: "https://images.unsplash.com/photo-1540039155732-684735035727?q=80&w=2070&auto=format&fit=crop",
    location: "Tokyo, Japan",
    date: "2026-10-15",
    time: "09:00 AM",
    description: "Join the largest Sui builder gathering in Asia. Connect, hack, and win.",
    about: "Step into the epicenter of Web3 innovation at the Sui Builder House Tokyo. Experience 3 days of intense hacking, deep-dive technical workshops, and networking with the brightest minds in blockchain. Whether you are deploying your first smart contract or optimizing a high-frequency trading bot, this is the place to build the future.",
    lineup: ["Evan Cheng", "Adeniyi Abiodun", "Mysten Labs Team"],
    organizer: "Mysten Labs",
    tags: ["CRYPTO", "HOUSE"],
    tradingStatus: "Live",
    settlementDate: "2026-10-13",
    marketStats: [
      { ticketClass: "Early Bird", originalPrice: 0.5, floorPrice: 1.2, change24h: 12.5, volume24h: "1.2K SUI", priceHistory: generateHistory(0.9, 0.15, 'up') },
      { ticketClass: "Regular", originalPrice: 1.0, floorPrice: 0.85, change24h: -5.2, volume24h: "800 SUI", priceHistory: generateHistory(1.0, 0.08, 'down') },
      { ticketClass: "VIP", originalPrice: 2.0, floorPrice: 3.5, change24h: 42.0, volume24h: "5.5K SUI", priceHistory: generateHistory(2.5, 0.3, 'up') }
    ]
  },
  {
    id: "evt_2",
    title: "Cyberpunk Music Festival",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop",
    location: "Neo-Seoul Arena",
    date: "2026-11-20",
    time: "18:00 PM",
    description: "A night of synthwave and holographic performances.",
    about: "Get ready to upload your consciousness into the rhythm. The Cyberpunk Music Festival brings together the world's top synthwave artists alongside cutting-edge holographic visuals. This isn't just a concert; it's a sensory override protocol. Ensure your neural links are calibrated.",
    lineup: ["The Midnight", "Kavinsky", "Gunship", "Holo-Band X"],
    organizer: "Neon Nights Inc.",
    tags: ["MUSIC", "LIVE"],
    tradingStatus: "Live",
    settlementDate: "2026-11-18",
    marketStats: [
      { ticketClass: "Regular", originalPrice: 1.5, floorPrice: 1.8, change24h: 2.1, volume24h: "400 SUI", priceHistory: generateHistory(1.6, 0.1, 'flat') },
      { ticketClass: "VIP", originalPrice: 3.0, floorPrice: 2.7, change24h: -10.5, volume24h: "1.1K SUI", priceHistory: generateHistory(3.0, 0.2, 'down') }
    ]
  },
  {
    id: "evt_3",
    title: "Web3 Gaming Summit",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    location: "Virtual & Dubai",
    date: "2026-12-05",
    time: "10:00 AM",
    description: "The future of gaming meets blockchain technology.",
    about: "Explore how blockchain is redefining digital ownership, game economies, and player empowerment. The Web3 Gaming Summit features massive game reveals, panel discussions on tokenomics, and an exclusive esports tournament played entirely on-chain.",
    lineup: ["Yield Guild Games", "Animoca Brands", "Gala Games"],
    organizer: "Blockchain Gaming Alliance",
    tags: ["GAMING", "TRENDING"],
    tradingStatus: "Live",
    settlementDate: "2026-12-03",
    marketStats: [
      { ticketClass: "Online Standard", originalPrice: 0.3, floorPrice: 0.5, change24h: 60.0, volume24h: "2.3K SUI", priceHistory: generateHistory(0.3, 0.05, 'up') },
      { ticketClass: "In-Person Pass", originalPrice: 2.0, floorPrice: 2.8, change24h: 15.4, volume24h: "3.4K SUI", priceHistory: generateHistory(2.2, 0.15, 'up') }
    ]
  },
  {
    id: "evt_4",
    title: "Devcon 8 - Global Hacker Space",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
    location: "Berlin, Germany",
    date: "2027-02-12",
    time: "08:00 AM",
    description: "Annual gathering for protocols, cryptography, and cypherpunks.",
    about: "Devcon 8 is bringing the core developers of the decentralized web together under one massive roof. From ZK-proofs breakthroughs to P2P networking protocols, dive deep into the tech that runs the new internet. Expect intensive workshops and zero corporate fluff.",
    lineup: ["Vitalik Buterin", "Zooko Wilcox", "Gavin Wood"],
    organizer: "Decentralized Foundation",
    tags: ["CRYPTO", "DEV"],
    tradingStatus: "Live",
    settlementDate: "2027-02-10",
    marketStats: [
      { ticketClass: "Hacker Pass", originalPrice: 0.8, floorPrice: 4.2, change24h: 300.0, volume24h: "15K SUI", priceHistory: generateHistory(2.5, 0.4, 'up') }
    ]
  },
  {
    id: "evt_5",
    title: "Art Block: Generative Exhibition",
    coverImage: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=1909&auto=format&fit=crop",
    location: "Paris, France",
    date: "2027-03-20",
    time: "14:00 PM",
    description: "An immersive gallery of code-generated, on-chain artworks.",
    about: "Experience art dictated by algorithms and immortalized on the blockchain. Art Block showcases over 50 prominent generative artists. Attendees will receive a live-minted POAP NFT that evolves beautifully over the duration of the 3-day exhibition.",
    lineup: ["Tyler Hobbs", "Snowfro", "Dmitri Cherniak"],
    organizer: "OnChain Arts",
    tags: ["ART", "NFT", "MINT"],
    tradingStatus: "Settled",
    settlementDate: "2027-03-18",
    marketStats: [
      { ticketClass: "Gallery Entry", originalPrice: 0.6, floorPrice: 0.6, change24h: 0, volume24h: "0 SUI", priceHistory: generateHistory(0.6, 0.02, 'flat') }
    ]
  },
  {
    id: "evt_6",
    title: "Startup Demo Day: Batch 44",
    coverImage: "https://images.unsplash.com/photo-1559136555-e4671a4f00d8?q=80&w=2069&auto=format&fit=crop",
    location: "San Francisco, CA",
    date: "2027-04-10",
    time: "09:30 AM",
    description: "Watch 50+ startups pitch to top-tier VCs and angel investors.",
    about: "The culmination of a rigorous 12-week accelerator program. Watch the founders of the next unicorn companies pitch their groundbreaking ideas live. A must-attend event for angel investors, VCs, and tech enthusiasts looking to spot the next big thing.",
    lineup: ["Y Combinator Partners", "Sequoia Capital", "A16Z"],
    organizer: "Valley Accelerators",
    tags: ["STARTUP", "PITCH"],
    tradingStatus: "Live",
    settlementDate: "2027-04-08",
    marketStats: [
      { ticketClass: "Investor Pass", originalPrice: 4.0, floorPrice: 3.5, change24h: -10.0, volume24h: "2.5K SUI", priceHistory: generateHistory(3.8, 0.2, 'down') }
    ]
  }
];

const TICKETS_DATA: Ticket[] = [
  { id: "t_101", eventId: "evt_1", ticketClass: "Early Bird", priceSui: 1.2, status: "available" },
  { id: "t_102", eventId: "evt_1", ticketClass: "Regular", priceSui: 0.85, status: "available" },
  { id: "t_103", eventId: "evt_1", ticketClass: "VIP", priceSui: 3.5, status: "available" },
  { id: "t_104", eventId: "evt_1", ticketClass: "VIP", priceSui: 3.6, status: "listing" },
  { id: "t_201", eventId: "evt_2", ticketClass: "Regular", priceSui: 1.8, status: "available" },
  { id: "t_202", eventId: "evt_2", ticketClass: "VIP", priceSui: 2.7, status: "available" },
  { id: "t_301", eventId: "evt_3", ticketClass: "Online Standard", priceSui: 0.5, status: "available" },
  { id: "t_302", eventId: "evt_3", ticketClass: "In-Person Pass", priceSui: 2.8, status: "available" },
  { id: "t_401", eventId: "evt_4", ticketClass: "Hacker Pass", priceSui: 4.2, status: "available" },
  { id: "t_501", eventId: "evt_5", ticketClass: "Gallery Entry", priceSui: 0.6, status: "sold" },
  { id: "t_601", eventId: "evt_6", ticketClass: "Investor Pass", priceSui: 3.5, status: "available" }
];

const COMMENTS_DATA: Record<string, Comment[]> = {
  "evt_1": [
    {
      id: "c1", author: "0xKrypto",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      content: "Prices for this event are pumping right now! Anyone selling VIP passes under 3 SUI?",
      timestamp: "2 hours ago", likes: 14,
      replies: [
        { id: "c1-r1", author: "WhaleSui", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack", content: "I'm dumping 5 VIPs if it hits 4 SUI. Hold your horses.", timestamp: "1 hour ago", likes: 3 },
        { id: "c1-r2", author: "SuiApe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ape", content: "Bro the floor is already at 3.5, you're dreaming 😂", timestamp: "45 mins ago", likes: 8,
          replies: [
            { id: "c1-r2-r1", author: "WhaleSui", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack2", content: "Oops, haven't checked the board. Thanks for the alpha.", timestamp: "30 mins ago", likes: 2 }
          ]
        }
      ]
    },
    { id: "c2", author: "NFT_Degen", avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=0x888", content: "Is this event going to have a token airdrop for attendees? Rumors say yes.", timestamp: "5 hours ago", likes: 42 }
  ]
};

// ========================================
// Public API Functions
// ========================================

/** Simulated network delay */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** GET /api/events */
export async function fetchEvents(): Promise<Event[]> {
  await delay(300);
  return structuredClone(EVENTS_DATA);
}

/** GET /api/events/:id */
export async function fetchEventById(eventId: string): Promise<Event | null> {
  await delay(150);
  const event = EVENTS_DATA.find(e => e.id === eventId);
  return event ? structuredClone(event) : null;
}

/** GET /api/tickets?eventId=xxx */
export async function fetchTicketsByEvent(eventId: string): Promise<Ticket[]> {
  await delay(200);
  return structuredClone(TICKETS_DATA.filter(t => t.eventId === eventId));
}

/** GET /api/events/:id/comments */
export async function fetchComments(eventId: string): Promise<Comment[]> {
  await delay(250);
  return structuredClone(COMMENTS_DATA[eventId] || []);
}

/** POST /api/events/:id/comments */
export async function postComment(eventId: string, comment: Comment): Promise<Comment> {
  await delay(200);
  if (!COMMENTS_DATA[eventId]) COMMENTS_DATA[eventId] = [];
  COMMENTS_DATA[eventId].unshift(comment);
  return structuredClone(comment);
}

/** GET /api/market/floor-price  – used by matching engine */
export async function fetchFloorPrice(eventId: string, ticketClass: string): Promise<number> {
  await delay(50);
  const event = EVENTS_DATA.find(e => e.id === eventId);
  const stat = event?.marketStats?.find(s => s.ticketClass === ticketClass);
  return stat?.floorPrice || 50;
}
