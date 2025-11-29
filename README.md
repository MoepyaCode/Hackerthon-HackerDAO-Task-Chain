# TaskChain Monorepo

This is a monorepo containing two projects: the frontend (Next.js dApp) and the blockchain (smart contracts on Celo).

## Structure

-   `frontend/`: Next.js application with Clerk authentication and GitHub integration
-   `blockchain/`: Hardhat project with Solidity smart contracts

## Development

### Frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Blockchain

```bash
cd blockchain
npm run compile
npm run test
```

## Deployment

### Smart Contracts

```bash
cd blockchain
npm run deploy:alfajores  # For testnet
npm run deploy:celo       # For mainnet
```

### dApp

```bash
cd frontend
npm run build
npm run start
```

## Environment Variables

Create `.env.local` in the root for Clerk and GitHub keys.

For blockchain, create `.env` in `blockchain/` with `PRIVATE_KEY` for deployment.
