export type TicketStatus = 'available' | 'sold' | 'listing';
export type TicketClass = 'VIP' | 'Regular' | 'Early Bird' | 'Online Standard' | 'In-Person Pass' | 'Hacker Pass' | 'Gallery Entry' | 'Investor Pass' | string;

export interface Ticket {
  id: string;
  eventId: string;
  ticketClass: TicketClass;
  priceSui: number; // Purchase price
  status: TicketStatus;
}

export interface MarketStat {
  ticketClass: TicketClass;
  originalPrice: number;
  floorPrice: number;
  change24h: number; // percentage, positive or negative
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

// Helper to generate fake price history
const generateHistory = (basePrice: number, volatility: number, trend: 'up' | 'down' | 'flat', dataPoints = 24) => {
  let currentPrice = basePrice;
  const history = [];
  const now = new Date();
  
  for (let i = dataPoints; i >= 0; i--) {
      // Add random walk
      const randomShift = (Math.random() - 0.5) * volatility;
      
      // Add trend
      let trendShift = 0;
      if (trend === 'up') trendShift = volatility * 0.2;
      if (trend === 'down') trendShift = -volatility * 0.2;

      currentPrice += randomShift + trendShift;
      if (currentPrice < 1) currentPrice = 1; // Prevent negative SUI

      const timePoint = new Date(now.getTime() - (i * 60 * 60 * 1000)); // Hourly data
      history.push({
          time: timePoint.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: Number(currentPrice.toFixed(2))
      });
  }
  return history;
};

export const MOCK_EVENTS: Event[] = [
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
    settlementDate: "2026-10-13", // Trading halts 2 days before
    marketStats: [
      { ticketClass: "Early Bird", originalPrice: 15, floorPrice: 45, change24h: 12.5, volume24h: "1.2K SUI", priceHistory: generateHistory(35, 5, 'up') },
      { ticketClass: "Regular", originalPrice: 25, floorPrice: 30, change24h: -5.2, volume24h: "800 SUI", priceHistory: generateHistory(32, 2, 'down') },
      { ticketClass: "VIP", originalPrice: 100, floorPrice: 250, change24h: 42.0, volume24h: "5.5K SUI", priceHistory: generateHistory(180, 15, 'up') }
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
      { ticketClass: "Regular", originalPrice: 50, floorPrice: 55, change24h: 2.1, volume24h: "400 SUI", priceHistory: generateHistory(52, 2, 'flat') },
      { ticketClass: "VIP", originalPrice: 150, floorPrice: 140, change24h: -10.5, volume24h: "1.1K SUI", priceHistory: generateHistory(155, 8, 'down') }
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
      { ticketClass: "Online Standard", originalPrice: 5, floorPrice: 8, change24h: 60.0, volume24h: "2.3K SUI", priceHistory: generateHistory(4, 1, 'up') },
      { ticketClass: "In-Person Pass", originalPrice: 80, floorPrice: 110, change24h: 15.4, volume24h: "3.4K SUI", priceHistory: generateHistory(95, 5, 'up') }
    ]
  },
  {
    // Keeping other events simple
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
      { ticketClass: "Hacker Pass", originalPrice: 10, floorPrice: 120, change24h: 300.0, volume24h: "15K SUI" }
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
      { ticketClass: "Gallery Entry", originalPrice: 20, floorPrice: 20, change24h: 0, volume24h: "0 SUI" }
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
      { ticketClass: "Investor Pass", originalPrice: 500, floorPrice: 450, change24h: -10.0, volume24h: "2.5K SUI" }
    ]
  }
];

export const MOCK_TICKETS: Ticket[] = [
  // Tickets for Event 1 (Trading at Floor)
  { id: "t_101", eventId: "evt_1", ticketClass: "Early Bird", priceSui: 45, status: "available" },
  { id: "t_102", eventId: "evt_1", ticketClass: "Regular", priceSui: 30, status: "available" },
  { id: "t_103", eventId: "evt_1", ticketClass: "VIP", priceSui: 250, status: "available" },
  { id: "t_104", eventId: "evt_1", ticketClass: "VIP", priceSui: 255, status: "listing" },
  
  // Tickets for Event 2
  { id: "t_201", eventId: "evt_2", ticketClass: "Regular", priceSui: 55, status: "available" },
  { id: "t_202", eventId: "evt_2", ticketClass: "VIP", priceSui: 140, status: "available" },

  // Tickets for Event 3
  { id: "t_301", eventId: "evt_3", ticketClass: "Online Standard", priceSui: 8, status: "available" },
  { id: "t_302", eventId: "evt_3", ticketClass: "In-Person Pass", priceSui: 110, status: "available" },

  // Tickets for Event 4
  { id: "t_401", eventId: "evt_4", ticketClass: "Hacker Pass", priceSui: 120, status: "available" },
  
  // Tickets for Event 5
  { id: "t_501", eventId: "evt_5", ticketClass: "Gallery Entry", priceSui: 20, status: "sold" },
  
  // Tickets for Event 6
  { id: "t_601", eventId: "evt_6", ticketClass: "Investor Pass", priceSui: 450, status: "available" }
];
