import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
	// Skip execution during build time
	if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
		return NextResponse.json({ error: "Service unavailable during build" }, { status: 503 });
	}

	try {
		// Dynamic import to avoid Prisma client initialization during build
		const { RewardService } = await import("@/services/reward.service");

		// Get user ID from auth (for now, using a placeholder)
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
		}

		const walletData = await RewardService.getWalletDataServer(userId);
		return NextResponse.json(walletData);
	} catch (error) {
		console.error("Error fetching wallet data:", error);
		return NextResponse.json({ error: "Failed to fetch wallet data" }, { status: 500 });
	}
}
