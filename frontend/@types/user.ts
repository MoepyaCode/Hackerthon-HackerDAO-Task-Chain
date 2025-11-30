import type { Contribution } from "./contribution";
import type { Reward } from "./reward";

export interface User {
	id: string;
	clerkId: string;
	walletAddress?: string;
	githubUsername?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserProfile extends User {
	contributions: Contribution[];
	rewards: Reward[];
}
