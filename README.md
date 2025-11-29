# TaskChain Monorepo

A decentralized application that gamifies developer contributions on GitHub, tracks performance on-chain, and distributes crypto rewards on Celo.

## Architecture

**On-Chain (Blockchain)**: Core immutable data

-   User contributions and points (PerformanceTracker contract)
-   Reward distributions and claims (RewardPool contract)
-   NFT badges for milestones (BadgeNFT contract)
-   Transparent leaderboard calculations

**Off-Chain (Database)**: Supporting data that can't be stored on-chain

-   User profiles and Clerk authentication mapping
-   Organization metadata and GitHub repo configurations
-   Cached on-chain data for performance
-   Transaction logs and analytics

## Project Structure

-   **`blockchain/`**: Smart contracts and deployment scripts
-   **`frontend/`**: Next.js dApp with Clerk auth and wallet integration
-   **Database**: SQLite (development) / PostgreSQL (production) via Prisma ORM

## Tech Stack

-   **Frontend**: Next.js 16, Clerk, Tailwind CSS
-   **Blockchain**: Solidity, Hardhat, Celo network
-   **Database**: Prisma ORM, SQLite/PostgreSQL
-   **Authentication**: Clerk (GitHub OAuth + wallet linking)

## Quick Start

### Prerequisites

-   Node.js 18+
-   npm/yarn

### Installation

```bash
npm install
```

### Database Setup

```bash
cd frontend
npx prisma generate
npx prisma migrate dev --name init
```

### Development

```bash
# Frontend
npm run dev

# Blockchain contracts
cd blockchain
npm run compile
npm run test
```

### Environment Variables

Create `.env.local` in `frontend/`:

```bash
# Clerk keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Database (optional, uses SQLite by default)
DATABASE_URL="file:./dev.db"
```

## Deployment

### Smart Contracts

```bash
cd blockchain
npm run deploy:alfajores  # Testnet
npm run deploy:celo       # For mainnet
```

### Frontend

```bash
cd frontend
npm run build
npm run start
```

```
# Clerk keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Database (optional, uses SQLite by default)
DATABASE_URL="file:./dev.db"
```

## Deployment

### Smart Contracts

```bash
cd blockchain
npm run deploy:alfajores  # Testnet
npm run deploy:celo       # For mainnet
```

### Frontend

```bash
cd frontend
npm run build
npm run start
```

## Data Flow

1. **GitHub Integration**: Fetch contributions via GitHub API
2. **On-Chain Logging**: Record contributions in PerformanceTracker contract
3. **Points Calculation**: Smart contract calculates scores and rankings
4. **Rewards Distribution**: RewardPool contract handles CELO payouts
5. **NFT Badges**: BadgeNFT contract mints achievement tokens
6. **Caching**: Prisma stores frequently accessed data for performance

## Key Features

-   **Transparent Tracking**: All contributions logged immutably on-chain
-   **Crypto Rewards**: CELO token payouts for top performers
-   **NFT Badges**: Soulbound tokens for milestones
-   **Real-time Leaderboards**: On-chain rankings with off-chain caching
-   **Wallet Integration**: MetaMask/Valora support for Celo network

## Development Philosophy

**Maximize On-Chain Data**: Store as much core data on-chain as possible for transparency and immutability, using database only for:

-   Performance optimization (caching)
-   Complex relationships not suitable for blockchain
-   User session data and authentication mapping
-   Analytics and reporting data

This ensures TaskChain remains truly decentralized while maintaining good UX.
