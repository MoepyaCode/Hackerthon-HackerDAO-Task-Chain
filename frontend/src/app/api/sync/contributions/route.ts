import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getRepositoryContributions } from "@/services/github-contributions.service";
import { prisma } from "@/lib/prisma";
import { ContributionService } from "@/services/contribution.service";
import { GitHubPullRequest, GitHubIssue, GitHubCommit } from "@/@types/github";
import { ContributionMetadata } from "@/@types/contribution";

export async function POST(req: Request) {
	try {
		const { userId, orgId } = await auth();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { owner, repo, since } = await req.json();

		if (!owner || !repo) {
			return NextResponse.json(
				{ error: "Missing required fields: owner, repo" },
				{ status: 400 },
			);
		}

		// Parse since date if provided
		const sinceDate = since ? new Date(since) : undefined;

		// Fetch contributions
		const contributions = await getRepositoryContributions(owner, repo, sinceDate);

		// Process and save to database
		const processedStats = {
			pullRequests: 0,
			issues: 0,
			commits: 0,
			pointsAwarded: 0,
		};

		// Helper to process a batch of items
		const processItems = async (
			items: (GitHubPullRequest | GitHubIssue | GitHubCommit)[],
			type: "pr" | "issue" | "commit",
			points: number,
		) => {
			for (const item of items) {
				const authorLogin = "authorLogin" in item ? item.authorLogin : item.author;
				if (!authorLogin) continue;

				// Find user by GitHub username
				const user = await prisma.user.findFirst({
					where: { githubUsername: authorLogin },
				});

				if (!user) continue; // Skip if user not in our system

				const externalId = "sha" in item ? item.sha : item.id.toString();
				const title = "title" in item ? item.title : item.message;

				// Check if already exists to avoid duplicates
				const existing = await prisma.contribution.findFirst({
					where: {
						userId: user.id,
						externalId: externalId,
						contributionType: type,
					},
				});

				if (existing) continue;

				// Sanitize metadata to remove nulls
				const rawMetadata = {
					title: title,
					repo: `${owner}/${repo}`,
					...item,
				};

				const metadata: ContributionMetadata = {};

				// Remove null values to satisfy ContributionMetadata type
				Object.entries(rawMetadata).forEach(([key, value]) => {
					if (value !== null && value !== undefined) {
						// We know these are safe types based on GitHub types
						metadata[key] = value as string | number | boolean;
					}
				});

				// Save contribution
				await ContributionService.cacheContribution(
					user.id,
					type,
					points,
					externalId,
					undefined, // No tx hash yet
					metadata,
				);

				processedStats[
					type === "pr" ? "pullRequests" : type === "issue" ? "issues" : "commits"
				]++;
				processedStats.pointsAwarded += points;
			}
		};

		// Process all types
		await processItems(contributions.pullRequests, "pr", 20);
		await processItems(contributions.issues, "issue", 10);
		await processItems(contributions.commits, "commit", 5);

		return NextResponse.json({
			success: true,
			message: "Contributions synced successfully",
			data: processedStats,
			organizationId: orgId,
		});
	} catch (error) {
		console.error("Error syncing contributions:", error);

		const errorMessage = error instanceof Error ? error.message : "Unknown error";

		return NextResponse.json(
			{ error: "Failed to sync contributions", details: errorMessage },
			{ status: 500 },
		);
	}
}

export async function GET(req: Request) {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const owner = searchParams.get("owner");
		const repo = searchParams.get("repo");
		const since = searchParams.get("since");

		if (!owner || !repo) {
			return NextResponse.json(
				{ error: "Missing required query params: owner, repo" },
				{ status: 400 },
			);
		}

		const sinceDate = since ? new Date(since) : undefined;

		const contributions = await getRepositoryContributions(owner, repo, sinceDate);

		return NextResponse.json({
			success: true,
			data: contributions,
		});
	} catch (error) {
		console.error("Error fetching contributions:", error);

		const errorMessage = error instanceof Error ? error.message : "Unknown error";

		return NextResponse.json(
			{ error: "Failed to fetch contributions", details: errorMessage },
			{ status: 500 },
		);
	}
}
