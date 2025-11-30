import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";

export async function getGitHubToken(): Promise<string> {
	const { userId } = await auth();

	if (!userId) {
		throw new Error("User not authenticated");
	}

	// Get the OAuth access token for GitHub
	const provider = "oauth_github";

	try {
		const client = await clerkClient();
		const clerkResponse = await client.users.getUserOauthAccessToken(userId, provider);

		if (!clerkResponse.data || clerkResponse.data.length === 0) {
			throw new Error(
				"GitHub account not connected. Please connect your GitHub account in settings.",
			);
		}

		const token = clerkResponse.data[0].token;

		if (!token) {
			throw new Error("GitHub access token not found. Please reconnect your GitHub account.");
		}

		return token;
	} catch {
		throw new Error("Failed to retrieve GitHub token. Please reconnect your GitHub account.");
	}
}

export async function hasGitHubConnected(): Promise<boolean> {
	try {
		const user = await currentUser();
		if (!user) return false;

		const githubAccount = user.externalAccounts.find(
			(account) => account.provider === "oauth_github",
		);

		return !!githubAccount;
	} catch {
		return false;
	}
}
