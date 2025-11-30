import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

	if (!WEBHOOK_SECRET) {
		throw new Error("Please add CLERK_WEBHOOK_SECRET to .env.local");
	}

	// Get the headers
	const headerPayload = await headers();
	const svix_id = headerPayload.get("svix-id");
	const svix_timestamp = headerPayload.get("svix-timestamp");
	const svix_signature = headerPayload.get("svix-signature");

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error: Missing svix headers", {
			status: 400,
		});
	}

	// Get the body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	// Create a new Svix instance with your secret
	const wh = new Webhook(WEBHOOK_SECRET);

	let evt: WebhookEvent;

	// Verify the payload with the headers
	try {
		evt = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		}) as WebhookEvent;
	} catch (err) {
		console.error("Error verifying webhook:", err);
		return new Response("Error: Verification failed", {
			status: 400,
		});
	}

	// Handle the webhook
	const eventType = evt.type;

	console.log(`Webhook received: ${eventType}`);

	try {
		switch (eventType) {
			case "organization.created": {
				console.log("Organization created:", evt.data);
				const { id, name, created_by } = evt.data;

				await prisma.organization.create({
					data: {
						id: id, // Use Clerk ID as the ID
						name: name,
						adminId: created_by || "",
					},
				});
				break;
			}

			case "organization.updated": {
				console.log("Organization updated:", evt.data);
				const { id, name } = evt.data;

				await prisma.organization.update({
					where: { id },
					data: { name },
				});
				break;
			}

			case "organization.deleted": {
				console.log("Organization deleted:", evt.data);
				const { id } = evt.data;

				await prisma.organization.delete({
					where: { id },
				});
				break;
			}

			case "organizationMembership.created": {
				console.log("Organization membership created:", evt.data);
				const { organization, public_user_data, role } = evt.data;

				const user = await prisma.user.findUnique({
					where: { clerkId: public_user_data.user_id },
				});

				if (user) {
					await prisma.organizationMember.create({
						data: {
							organizationId: organization.id,
							userId: user.id,
							role: role,
						},
					});
				} else {
					console.warn(
						`User not found for membership creation: ${public_user_data.user_id}`,
					);
				}
				break;
			}

			case "organizationMembership.deleted": {
				console.log("Organization membership deleted:", evt.data);
				const { organization, public_user_data } = evt.data;

				const user = await prisma.user.findUnique({
					where: { clerkId: public_user_data.user_id },
				});

				if (user) {
					await prisma.organizationMember.delete({
						where: {
							userId_organizationId: {
								userId: user.id,
								organizationId: organization.id,
							},
						},
					});
				}
				break;
			}

			case "user.created": {
				console.log("User created:", evt.data);
				const { id, username, external_accounts, web3_wallets } = evt.data;

				// Try to find GitHub username from external accounts
				let githubUsername = username;
				if (external_accounts && Array.isArray(external_accounts)) {
					const githubAccount = external_accounts.find(
						(acc) => acc.provider === "oauth_github",
					);
					if (githubAccount && githubAccount.username) {
						githubUsername = githubAccount.username;
					}
				}

				// Extract Web3 Wallet
				let walletAddress = null;
				if (web3_wallets && Array.isArray(web3_wallets) && web3_wallets.length > 0) {
					walletAddress = web3_wallets[0].web3_wallet;
				}

				await prisma.user.create({
					data: {
						clerkId: id,
						githubUsername: githubUsername || null,
						walletAddress: walletAddress,
					},
				});
				break;
			}

			case "user.updated": {
				console.log("User updated:", evt.data);
				const { id, username, external_accounts, web3_wallets } = evt.data;

				let githubUsername = username;
				if (external_accounts && Array.isArray(external_accounts)) {
					const githubAccount = external_accounts.find(
						(acc) => acc.provider === "oauth_github",
					);
					if (githubAccount && githubAccount.username) {
						githubUsername = githubAccount.username;
					}
				}

				// Extract Web3 Wallet
				let walletAddress = null;
				if (web3_wallets && Array.isArray(web3_wallets) && web3_wallets.length > 0) {
					walletAddress = web3_wallets[0].web3_wallet;
				}

				await prisma.user.update({
					where: { clerkId: id },
					data: {
						githubUsername: githubUsername || null,
						walletAddress: walletAddress, // Update wallet address if changed
					},
				});
				break;
			}

			case "user.deleted": {
				console.log("User deleted:", evt.data);
				const { id } = evt.data;

				if (id) {
					await prisma.user.delete({
						where: { clerkId: id },
					});
				}
				break;
			}

			default:
				console.log(`Unhandled event type: ${eventType}`);
		}
	} catch (error) {
		console.error("Error handling webhook event:", error);
		return new Response("Error processing webhook", { status: 500 });
	}

	return new Response("Webhook received", { status: 200 });
}
