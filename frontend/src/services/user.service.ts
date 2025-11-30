import type { User, UserProfile, ContributionType, ContributionMetadata } from "@/@types";
import { prisma } from "@/lib/prisma";

// Service for managing user profiles and wallet linking
export class UserService {
	static async getCurrentUser(): Promise<User | null> {
		// TODO: Get from Clerk context
		return null;
	}

	static async getUserProfile(userId: string): Promise<UserProfile | null> {
		try {
			const user = await prisma.user.findUnique({
				where: { clerkId: userId },
				include: {
					contributions: {
						include: {
							repo: {
								include: {
									organization: true,
								},
							},
						},
					},
					rewards: true,
				},
			});

			if (!user) return null;

			return {
				id: user.id,
				clerkId: user.clerkId,
				walletAddress: user.walletAddress || undefined,
				githubUsername: user.githubUsername || undefined,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				contributions:
					user.contributions?.map((c) => ({
						id: c.id,
						userId: c.userId,
						organizationId: c.repo?.organizationId || "",
						repositoryId: c.repoId || "",
						type: c.contributionType as ContributionType,
						points: c.points,
						metadata: c.metadata as ContributionMetadata,
						createdAt: c.createdAt,
					})) || [],
				rewards:
					user.rewards?.map((r) => ({
						id: r.id,
						userId: r.userId,
						amount: r.amount,
						type: r.rewardType,
						onChainTxHash: r.onChainTxHash,
						claimedAt: r.claimedAt,
						createdAt: r.createdAt,
					})) || [],
			};
		} catch (error) {
			console.error("Error getting user profile:", error);
			return null;
		}
	}

	static async updateUser(userId: string, data: Partial<User>): Promise<User> {
		try {
			const updatedUser = await prisma.user.update({
				where: { clerkId: userId },
				data: {
					walletAddress: data.walletAddress,
					githubUsername: data.githubUsername,
					updatedAt: new Date(),
				},
			});

			return {
				id: updatedUser.id,
				clerkId: updatedUser.clerkId,
				walletAddress: updatedUser.walletAddress || undefined,
				githubUsername: updatedUser.githubUsername || undefined,
				createdAt: updatedUser.createdAt,
				updatedAt: updatedUser.updatedAt,
			};
		} catch (error) {
			console.error("Error updating user:", error);
			throw new Error("Failed to update user");
		}
	}

	static async linkWallet(userId: string, walletAddress: string): Promise<User> {
		try {
			const updatedUser = await prisma.user.update({
				where: { clerkId: userId },
				data: {
					walletAddress,
					updatedAt: new Date(),
				},
			});

			return {
				id: updatedUser.id,
				clerkId: updatedUser.clerkId,
				walletAddress: updatedUser.walletAddress || undefined,
				githubUsername: updatedUser.githubUsername || undefined,
				createdAt: updatedUser.createdAt,
				updatedAt: updatedUser.updatedAt,
			};
		} catch (error) {
			console.error("Error linking wallet:", error);
			throw new Error("Failed to link wallet");
		}
	}

	// Create user profile when they first sign in
	static async createUserProfile(clerkId: string, githubUsername?: string): Promise<UserProfile> {
		try {
			const user = await prisma.user.create({
				data: {
					clerkId,
					githubUsername,
				},
				include: {
					contributions: {
						include: {
							repo: {
								include: {
									organization: true,
								},
							},
						},
					},
					rewards: true,
				},
			});

			return {
				id: user.id,
				clerkId: user.clerkId,
				walletAddress: user.walletAddress || undefined,
				githubUsername: user.githubUsername || undefined,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				contributions:
					user.contributions?.map((c) => ({
						id: c.id,
						userId: c.userId,
						organizationId: c.repo?.organizationId || "",
						repositoryId: c.repoId || "",
						type: c.contributionType as ContributionType,
						points: c.points,
						metadata: c.metadata as ContributionMetadata,
						createdAt: c.createdAt,
					})) || [],
				rewards:
					user.rewards?.map((r) => ({
						id: r.id,
						userId: r.userId,
						amount: r.amount,
						type: r.rewardType,
						onChainTxHash: r.onChainTxHash,
						claimedAt: r.claimedAt,
						createdAt: r.createdAt,
					})) || [],
			};
		} catch (error) {
			console.error("Error creating user profile:", error);
			throw new Error("Failed to create user profile");
		}
	}
}
