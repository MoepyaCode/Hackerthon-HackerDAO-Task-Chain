import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { txHash } = await req.json();
		if (!txHash) {
			return new NextResponse("Missing transaction hash", { status: 400 });
		}

		// Find the oldest unclaimed reward for the user
		const reward = await prisma.reward.findFirst({
			where: {
				userId,
				claimedAt: null,
			},
			orderBy: {
				createdAt: "asc",
			},
		});

		if (!reward) {
			return new NextResponse("No unclaimed rewards found", { status: 404 });
		}

		// Update the reward
		const updatedReward = await prisma.reward.update({
			where: {
				id: reward.id,
			},
			data: {
				claimedAt: new Date(),
				onChainTxHash: txHash,
			},
		});

		return NextResponse.json(updatedReward);
	} catch (error) {
		console.error("[REWARD_CONFIRM_CLAIM]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
