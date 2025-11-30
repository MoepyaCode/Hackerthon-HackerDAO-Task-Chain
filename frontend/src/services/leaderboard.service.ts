import type { LeaderboardEntry, LeaderboardFilters, LeaderboardStats } from "@/@types";
import { prisma } from "@/lib/prisma";

interface LeaderboardData {
	stats: LeaderboardStats;
	leaderboardData: LeaderboardEntry[];
}

// Service for leaderboard - uses DB caching with on-chain data as source of truth
export class LeaderboardService {
	// Get leaderboard from DB cache (refreshed from on-chain data)
	static async getLeaderboard(filters: LeaderboardFilters): Promise<LeaderboardEntry[]> {
		try {
			// Calculate date range based on period
			let dateFilter = {};
			const now = new Date();
			if (filters.period === "WEEKLY") {
				const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
				dateFilter = { createdAt: { gte: lastWeek } };
			} else if (filters.period === "MONTHLY") {
				const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
				dateFilter = { createdAt: { gte: lastMonth } };
			}

			// Fetch users with their contributions
			const users = await prisma.user.findMany({
				where: {
					contributions: {
						some: dateFilter,
					},
				},
				include: {
					contributions: {
						where: dateFilter,
					},
				},
			});

			// Calculate stats for each user
			const leaderboard = users.map((user) => {
				const points = user.contributions.reduce((sum, c) => sum + c.points, 0);
				const issues = user.contributions.filter(
					(c) => c.contributionType === "issue",
				).length;
				const prs = user.contributions.filter((c) => c.contributionType === "pr").length;
				const commits = user.contributions.filter(
					(c) => c.contributionType === "commit",
				).length;

				return {
					userId: user.id,
					githubUsername: user.githubUsername || "Unknown",
					avatarUrl: null, // TODO: Add avatar URL to User model
					totalPoints: points,
					issuesClosed: issues,
					prsOpened: prs,
					prsMerged: 0, // Not tracked separately yet
					commitsPushed: commits,
					change: 0, // TODO: Calculate rank change
					rank: 0,
				};
			});

			// Sort by points descending
			leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

			// Assign ranks
			leaderboard.forEach((entry, index) => {
				entry.rank = index + 1;
			});

			return leaderboard;
		} catch (error) {
			console.error("Error fetching leaderboard:", error);
			return [];
		}
	}

	// Cache leaderboard data
	static async cacheLeaderboard(period: string, data: LeaderboardData): Promise<void> {
		try {
			const expiresAt = new Date();
			expiresAt.setHours(expiresAt.getHours() + 1); // Cache for 1 hour

			await prisma.cachedLeaderboard.upsert({
				where: { period },
				update: {
					data,
					expiresAt,
					cachedAt: new Date(),
				},
				create: {
					period,
					data,
					expiresAt,
					cachedAt: new Date(),
				},
			});
		} catch (error) {
			console.error("Error caching leaderboard:", error);
		}
	}

	static async getLeaderboardStats(filters: LeaderboardFilters): Promise<LeaderboardStats> {
		try {
			// Check cache first
			const cached = await prisma.cachedLeaderboard.findUnique({
				where: { period: filters.period || "weekly" },
			});

			if (cached && cached.expiresAt > new Date()) {
				const cachedData = JSON.parse(cached.data as string) as LeaderboardData;
				return cachedData.stats;
			}

			// TODO: Calculate from on-chain data
			const response = await fetch("/data/leaderboard.json");
			const data: LeaderboardData = await response.json();

			// Cache the data
			await this.cacheLeaderboard(filters.period || "weekly", data);

			return data.stats;
		} catch (error) {
			console.error("Error getting leaderboard stats:", error);
			throw new Error("Failed to get leaderboard stats");
		}
	}

	static async getUserRank(userId: string, filters: LeaderboardFilters): Promise<number> {
		try {
			const leaderboard = await this.getLeaderboard(filters);
			const entry = leaderboard.find((e) => e.userId === userId);
			return entry?.rank || 0;
		} catch (error) {
			console.error("Error getting user rank:", error);
			return 0;
		}
	}

	// Refresh leaderboard from on-chain data
	static async refreshLeaderboardFromChain(period: string): Promise<void> {
		// TODO: Fetch from PerformanceTracker contract
		// Calculate rankings
		// Cache in DB
		console.log(`Refreshing leaderboard for period: ${period}`);
	}
}
