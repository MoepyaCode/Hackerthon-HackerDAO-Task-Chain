# TaskChain

## Overview

TaskChain is a decentralized application (dApp) that integrates with project management platforms (starting with GitHub, and later Jira, Zendesk, GitBucket, Azure DevOps) to gamify productivity. It tracks contributions such as tickets completed, pull requests opened/merged, and issues resolved. Developers earn points, climb leaderboards, and receive crypto rewards and NFT badges for milestones. Authentication is handled via GitHub OAuth, with wallet linking through Clerk.

---

## Goals

-   Motivate teams by gamifying contributions across project management tools.
-   Provide transparent, blockchain-backed tracking of performance.
-   Reward productivity with crypto payouts and NFT badges.
-   Deliver a polished Next.js frontend with wallet dashboard and analytics.
-   Scale to support multiple platforms beyond GitHub.

---

## Core Features

1. **Authentication**

    - Sign in with GitHub OAuth.
    - Link crypto wallet (MetaMask) via Clerk.

2. **Team & Project Setup**

    - Org admin integrates GitHub organization.
    - Select repos/projects to track.
    - Invite members via Clerk.

3. **Contribution Tracking**

    - Metrics: issues closed, PRs opened, PRs merged, commits pushed.
    - Points system for each contribution type.
    - Cron job syncs GitHub data to DB (avoiding rate limits).

4. **Leaderboard**

    - Points aggregated per user.
    - Weekly/monthly rankings displayed.

5. **Rewards**

    - Crypto payouts distributed to top performers via smart contracts.
    - NFT badges minted for milestones (e.g., “10 PRs merged”).

6. **Wallet Dashboard**
    - Shows transactions, payouts, wins/losses, badges earned.
    - Analytics: contribution history, performance trends, reward totals.

---

## Tech Stack

-   **Frontend**: Next.js, Clerk.
-   **Blockchain**: Celo (future multi-chain support).
-   **Smart Contracts**: Solidity (RewardPool, BadgeNFT, PerformanceTracker).
-   **Database**: Postgres (stores GitHub data, points, leaderboard snapshots).
-   **Integration**: GitHub REST/GraphQL APIs (future: Jira, Zendesk, Azure DevOps).

---

## Smart Contract Modules

-   **PerformanceTracker.sol**

    -   `logContribution(user, type, points)`
    -   `getUserPoints(address)`
    -   `getLeaderboard()`

-   **RewardPool.sol**

    -   `distributeRewards()`
    -   `addPrizePool(amount)`
    -   `claimReward(address)`

-   **BadgeNFT.sol**
    -   `mintBadge(address, milestone)`
    -   `getBadges(address)`

---

## Deliverables

-   Usable dApp deployed on Celo testnet/mainnet.
-   Public GitHub repo with source code + setup instructions.
-   Demo video (≤ 4 minutes) showcasing GitHub integration, leaderboard, rewards, and wallet dashboard.
