import type { Badge } from './badge';
import type { Contribution } from './contribution';
import type { Reward } from './reward';

export interface User {
  id: string;
  githubId: string;
  githubUsername: string;
  walletAddress: string | null;
  email: string;
  avatarUrl: string | null;
  totalPoints: number;
  rank: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  badges: Badge[];
  contributions: Contribution[];
  rewards: Reward[];
}
