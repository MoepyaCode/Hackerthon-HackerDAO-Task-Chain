/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UserBadge, Badge } from "@/@types";
import { BadgeMilestone } from "@/@types/badge";
import { prisma } from "@/lib/prisma";

const DEFINED_BADGES: Badge[] = [
	{
		id: "first-contribution",
		name: "First Step",
		description: "Made your first contribution",
		imageUrl: "/badges/first-contribution.png",
		milestone: BadgeMilestone.FIRST_CONTRIBUTION,
		nftTokenId: null,
		nftContractAddress: null,
		createdAt: new Date("2024-01-01"),
	},
	{
		id: "prs-10",
		name: "Code Warrior",
		description: "Merged 10 Pull Requests",
		imageUrl: "/badges/prs-10.png",
		milestone: BadgeMilestone.PRS_10,
		nftTokenId: null,
		nftContractAddress: null,
		createdAt: new Date("2024-01-01"),
	},
	// Add more badges as needed
];

// Service for managing badges
export class BadgeService {
	static async getUserBadges(userId: string): Promise<UserBadge[]> {
		// Calculate earned badges dynamically based on contributions
		const earnedBadges = await this.checkEligibleBadges(userId);

		return earnedBadges.map((badge) => ({
			id: `ub-${userId}-${badge.id}`,
			userId,
			badgeId: badge.id,
			badge,
			earnedAt: new Date(), // In a real app, this would be stored in DB
			txHash: null,
			isMinted: false,
		}));
	}

	static async getAllBadges(): Promise<Badge[]> {
		return DEFINED_BADGES;
	}

	static async mintBadge(_userBadgeId: string): Promise<UserBadge> {
		// TODO: Implement interaction with smart contract to mint NFT
		throw new Error("Minting not implemented yet");
	}

	static async checkEligibleBadges(userId: string): Promise<Badge[]> {
		const stats = await prisma.contribution.groupBy({
			by: ["contributionType"],
			where: { userId },
			_count: true,
		});

		const totalContributions: number = stats.reduce(
			(acc: number, curr: any) => acc + (curr._count as number),
			0,
		);
		const prs = (stats.find((s: any) => s.contributionType === "pr") as any)?._count || 0;

		const eligible: Badge[] = [];

		if (totalContributions >= 1) {
			const badge = DEFINED_BADGES.find(
				(b) => b.milestone === BadgeMilestone.FIRST_CONTRIBUTION,
			);
			if (badge) eligible.push(badge);
		}

		if (prs >= 10) {
			const badge = DEFINED_BADGES.find((b) => b.milestone === BadgeMilestone.PRS_10);
			if (badge) eligible.push(badge);
		}

		return eligible;
	}
}
