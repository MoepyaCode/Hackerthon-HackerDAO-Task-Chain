import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { BadgeService } from "@/services/badge.service";
import { mintBadgeOnChain } from "@/lib/blockchain-admin";

export async function POST(req: Request) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: { clerkId: userId },
		});

		if (!user || !user.walletAddress) {
			return new NextResponse("User not found or wallet not connected", { status: 404 });
		}

		const { badgeId } = await req.json();

		// Check eligibility
		const eligibleBadges = await BadgeService.checkEligibleBadges(user.id);
		const badge = eligibleBadges.find((b) => b.id === badgeId);

		if (!badge) {
			return new NextResponse("User not eligible for this badge", { status: 400 });
		}

		// Mint on chain
		const txHash = await mintBadgeOnChain(
			user.walletAddress,
			badge.name,
			badge.description,
			badge.milestone,
		);

		return NextResponse.json({ txHash });
	} catch (error) {
		console.error("Error minting badge:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
