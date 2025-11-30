import type { Reward, RewardPool, RewardTransaction } from "@/@types";
import { prisma } from "@/lib/prisma";
import { BadgeService } from "./badge.service";

// Service for managing rewards - combines on-chain data with DB caching
export class RewardService {
	// Get user rewards from DB (cached from on-chain data)
	static async getUserRewards(userId: string): Promise<Reward[]> {
		try {
			const rewards = await prisma.reward.findMany({
				where: { userId },
				orderBy: { createdAt: "desc" },
			});

			return rewards.map((r) => ({
				id: r.id,
				userId: r.userId,
				amount: r.amount,
				type: r.rewardType,
				onChainTxHash: r.onChainTxHash,
				claimedAt: r.claimedAt,
				createdAt: r.createdAt,
			}));
		} catch (error) {
			console.error("Error fetching user rewards:", error);
			return [];
		}
	}

	// Cache reward data from on-chain
	static async cacheReward(
		userId: string,
		amount: string,
		rewardType: string,
		onChainTxHash?: string,
	): Promise<void> {
		try {
			await prisma.reward.create({
				data: {
					userId,
					amount,
					rewardType,
					onChainTxHash,
				},
			});
		} catch (error) {
			console.error("Error caching reward:", error);
		}
	}

	// Mark reward as claimed
	static async markRewardClaimed(rewardId: string): Promise<void> {
		try {
			await prisma.reward.update({
				where: { id: rewardId },
				data: { claimedAt: new Date() },
			});
		} catch (error) {
			console.error("Error marking reward as claimed:", error);
		}
	}

	static async claimReward(rewardId: string): Promise<RewardTransaction> {
		// TODO: Implement on-chain claim
		// For now, just mark as claimed in DB
		await this.markRewardClaimed(rewardId);

		const reward = await prisma.reward.findUnique({
			where: { id: rewardId },
		});

		if (!reward) {
			throw new Error("Reward not found");
		}

		return {
			id: reward.id,
			userId: reward.userId,
			amount: reward.amount,
			currency: "CELO",
			type: "CLAIM",
			status: "COMPLETED",
			txHash: reward.onChainTxHash,
			date: reward.claimedAt?.toISOString() || new Date().toISOString(),
		};
	}

	static async getRewardPool(_organizationId: string, _period: string): Promise<RewardPool> {
		// TODO: Get from on-chain contract
		// For now, return mock data
		throw new Error("Reward pool not implemented yet");
	}

	// Get wallet data - combines on-chain balance with DB transactions (SERVER-SIDE ONLY)
	static async getWalletDataServer(userId: string) {
		try {
			// Fetch user data
			const user = await prisma.user.findUnique({
				where: { id: userId },
			});

			if (!user) {
				throw new Error("User not found");
			}

			// Calculate rewards from DB
			const rewards = await prisma.reward.findMany({
				where: { userId },
			});

			const totalEarned = rewards.reduce((sum, r) => sum + parseFloat(r.amount), 0);
			const pendingRewards = rewards
				.filter((r) => !r.claimedAt)
				.reduce((sum, r) => sum + parseFloat(r.amount), 0);

			// Get transactions from DB
			const dbTransactions = await prisma.reward.findMany({
				where: { userId },
				orderBy: { createdAt: "desc" },
			});

			const transactions = dbTransactions.map((r) => ({
				id: r.id,
				type: r.rewardType === "weekly" ? "REWARD" : "MILESTONE",
				amount: r.amount,
				currency: "CELO",
				status: r.claimedAt ? "COMPLETED" : "PENDING",
				txHash: r.onChainTxHash,
				date: r.createdAt.toISOString(),
				description: `${r.rewardType} reward`,
			}));

			// Get badges
			const userBadges = await BadgeService.getUserBadges(userId);
			const badges = userBadges.map((ub) => ({
				id: ub.badge.id,
				name: ub.badge.name,
				description: ub.badge.description,
				imageUrl: ub.badge.imageUrl,
				earnedAt: ub.earnedAt.toISOString(),
				isMinted: ub.isMinted,
				nftTokenId: ub.badge.nftTokenId,
			}));

			return {
				walletData: {
					address: user.walletAddress || "Not Connected",
					balance: "0.00", // TODO: Fetch real balance from blockchain
					totalEarned: totalEarned.toFixed(2),
					pendingRewards: pendingRewards.toFixed(2),
				},
				transactions,
				badges,
			};
		} catch (error) {
			console.error("Error getting wallet data:", error);
			throw error;
		}
	}

	static async getRewardTransactions(userId: string): Promise<RewardTransaction[]> {
		try {
			const rewards = await prisma.reward.findMany({
				where: { userId },
				orderBy: { createdAt: "desc" },
			});

			return rewards.map((r) => ({
				id: r.id,
				userId: r.userId,
				amount: r.amount,
				currency: "CELO",
				type: r.rewardType === "weekly" ? "REWARD" : "MILESTONE",
				status: r.claimedAt ? "COMPLETED" : "PENDING",
				txHash: r.onChainTxHash,
				date: r.createdAt.toISOString(),
			}));
		} catch (error) {
			console.error("Error fetching reward transactions:", error);
			return [];
		}
	}
}
