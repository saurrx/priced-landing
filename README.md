# PRICED

**Trade prediction markets in one click, right from your Twitter feed.**

Priced is a Chrome extension that matches tweets to live prediction markets and lets you trade instantly via Solana — no app switching, no friction. This repo is the landing page + wallet-gated portfolio dashboard.

## What is Priced?

Priced runs silently in the background while you browse X (Twitter). When you scroll past a tweet that maps to a live prediction market, Priced surfaces the odds inline — right below the tweet — with one-click YES/NO trading powered by Solana Blinks.

- Matches tweets to markets with 92% accuracy in under 500ms
- Trades execute on-chain via Jupiter Prediction Markets
- Supports Kalshi, DFlow, and Jupiter market sources

## Portfolio Dashboard

The `/portfolio` page is a wallet-gated dashboard where connected users can:

- **View positions** — See all active, settled, and claimable prediction market positions in one place
- **Track PnL** — Interactive chart showing realized profit/loss over 24h, 1 week, or 1 month intervals
- **Portfolio summary** — Cards showing total portfolio value, unrealized PnL, win rate, and claimable winnings
- **Claim winnings** — One-click claim for settled positions that resolved in your favor, with transaction signing via your Solana wallet
- **Close positions** — Exit active positions early at current market price
- **Trade history** — Full timeline of all orders, fills, payouts, and position updates

## Tech Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **Tailwind CSS 4** with custom dark theme tokens
- **Solana wallet-adapter-react** for wallet connection and transaction signing
- **SWR** for data fetching with automatic revalidation
- **Recharts** for PnL visualization
- **Framer Motion** for animations
- **Jupiter Prediction Market API** for positions, history, and PnL data

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

### Environment Variables

Create a `.env.local` file:

```
JUPITER_API_KEY=your_api_key_here
```

## Project Structure

```
src/
  app/
    page.tsx              # Landing page
    portfolio/page.tsx    # Wallet-gated portfolio dashboard
    api/                  # API routes (portfolio, pnl-chart, history, claim, close-position)
  components/
    Nav.tsx               # Navbar with wallet dropdown + disconnect
    Hero.tsx              # Landing hero with shader background
    TweetDemo.tsx         # Interactive tweet demo section
    PortfolioSummary.tsx  # Portfolio value / PnL / claimable cards
    PnlChart.tsx          # Recharts PnL area chart
    PositionCard.tsx      # Individual position display
    HistoryTimeline.tsx   # Trade history feed
    ClosePositionModal.tsx
    ConnectWalletModal.tsx
    Footer.tsx
    Toast.tsx             # Toast notification system
    ErrorBoundary.tsx
  lib/
    jupiter.ts            # Jupiter API types, fetch helpers, data converters
    transactions.ts       # Solana transaction signing with retry logic
    fetcher.ts            # Safe SWR fetcher
    errors.ts             # User-friendly error messages
    format.ts             # USD/percent formatting
    useIsMobile.ts        # Reactive mobile detection hook
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

Set `JUPITER_API_KEY` in your Vercel project environment variables.
