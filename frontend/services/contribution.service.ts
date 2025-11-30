import type {
	Contribution,
	ContributionStats,
	ContributionHistory,
	ContributionMetadata,
	ContributionType,
} from "@/@types";
import { prisma } from "@/lib/prisma";

// Service for managing contributions - combines on-chain data with DB caching
export class ContributionService {
	// Get user contributions from DB (cached from on-chain data)
	static async getUserContributions(userId: string, limit?: number): Promise<Contribution[]> {
		try {
			const contributions = await prisma.contribution.findMany({
				where: { userId },
				include: {
					repo: {
						include: {
							organization: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
				take: limit,
			});

			return contributions.map((c) => ({
				id: c.id,
				userId: c.userId,
				repoId: c.repoId,
				contributionType: c.contributionType,
				externalId: c.externalId,
				points: c.points,
				metadata: c.metadata,
				onChainTxHash: c.onChainTxHash,
				createdAt: c.createdAt,
				repo: c.repo
					? {
							fullName: c.repo.fullName,
							organization: c.repo.organization
								? {
										name: c.repo.organization.name,
								  }
								: undefined,
					  }
					: undefined,
			}));
		} catch (error) {
			console.error("Error fetching user contributions:", error);
			return [];
		}
	}

	// Cache contribution data from GitHub/on-chain
	static async cacheContribution(
		userId: string,
		contributionType: string,
		points: number,
		externalId: string,
		onChainTxHash?: string,
		metadata?: ContributionMetadata,
	): Promise<void> {
		try {
			await prisma.contribution.create({
				data: {
					userId,
					contributionType,
					points,
					externalId,
					onChainTxHash,
					metadata,
				},
			});
		} catch (error) {
			console.error("Error caching contribution:", error);
		}
	}

	static async getContributionStats(userId: string): Promise<ContributionStats> {
		try {
			const contributions = await prisma.contribution.findMany({
				where: { userId },
			});

			const totalPoints = contributions.reduce((sum, c) => sum + c.points, 0);
			const totalContributions = contributions.length;

			// Group by type
			const byType = contributions.reduce((acc, c) => {
				acc[c.contributionType] = (acc[c.contributionType] || 0) + 1;
				return acc;
			}, {} as Record<string, number>);

			return {
				totalPoints,
				totalContributions,
				issuesClosed: byType.ISSUE_CLOSED || 0,
				prsOpened: byType.PR_OPENED || 0,
				prsMerged: byType.PR_MERGED || 0,
				commitsPushed: byType.COMMIT_PUSHED || 0,
				contributionsByType: byType,
				lastUpdated: new Date(),
			};
		} catch (error) {
			console.error("Error getting contribution stats:", error);
			throw new Error("Failed to get contribution stats");
		}
	}

	static async getContributionHistory(
		userId: string,
		days: number = 30,
	): Promise<ContributionHistory[]> {
		try {
			const startDate = new Date();
			startDate.setDate(startDate.getDate() - days);

			const contributions = await prisma.contribution.findMany({
				where: {
					userId,
					createdAt: {
						gte: startDate,
					},
				},
				orderBy: { createdAt: "desc" },
			});

			// Group by date
			const grouped = contributions.reduce((acc, c) => {
				const date = c.createdAt.toISOString().split("T")[0];
				if (!acc[date]) {
					acc[date] = { date, contributions: [], totalPoints: 0 };
				}
				acc[date].contributions.push({
					id: c.id,
					type: c.contributionType as ContributionType,
					points: c.points,
					timestamp: c.createdAt,
				});
				acc[date].totalPoints += c.points;
				return acc;
			}, {} as Record<string, ContributionHistory>);

			return Object.values(grouped);
		} catch (error) {
			console.error("Error getting contribution history:", error);
			return [];
		}
	}

	// Sync GitHub data and cache in DB (will also log to blockchain)
	static async syncGitHubData(_organizationId: string): Promise<void> {
		// TODO: Implement GitHub sync
		// 1. Fetch GitHub data
		// 2. Calculate points
		// 3. Cache in DB
		// 4. Log to blockchain
		throw new Error("GitHub sync not implemented yet");
	}
}
