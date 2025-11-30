export class RewardClientService {
	static async getWalletData(userId: string) {
		try {
			const response = await fetch("/api/wallet");
			if (!response.ok) {
				throw new Error("Failed to fetch wallet data");
			}
			return await response.json();
		} catch (error) {
			console.error("Error getting wallet data:", error);
			throw error;
		}
	}
}
