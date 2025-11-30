import { createPublicClient, createWalletClient, http, parseEther, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { CONTRACT_ADDRESSES, REWARD_POOL_ABI, PERFORMANCE_TRACKER_ABI, BADGE_NFT_ABI } from './contracts';

const celoSepolia = defineChain({
	id: 11142220,
	name: "Celo Sepolia",
	nativeCurrency: {
		decimals: 18,
		name: "Celo",
		symbol: "CELO",
	},
	rpcUrls: {
		default: {
			http: ["https://forno.celo-sepolia.celo-testnet.org"],
		},
	},
	blockExplorers: {
		default: { name: "Celo Explorer", url: "https://celo-sepolia.blockscout.com" },
	},
	testnet: true,
});

const chain = celoSepolia;

export async function addRewardToPool(userAddress: string, amount: number) {
    if (!process.env.ADMIN_PRIVATE_KEY) {
        console.error("ADMIN_PRIVATE_KEY not found");
        return;
    }

    try {
        const account = privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY as `0x${string}`);
        const client = createWalletClient({
            account,
            chain,
            transport: http()
        });
        const publicClient = createPublicClient({
            chain,
            transport: http()
        });

        console.log(`Adding reward of ${amount} CELO to ${userAddress}...`);
        const hash = await client.writeContract({
            address: CONTRACT_ADDRESSES.rewardPool,
            abi: REWARD_POOL_ABI,
            functionName: 'addReward',
            args: [userAddress as `0x${string}`, parseEther(amount.toString())]
        });

        await publicClient.waitForTransactionReceipt({ hash });
        console.log(`Reward added! Tx Hash: ${hash}`);
        return hash;
    } catch (error) {
        console.error("Error adding reward to pool:", error);
        throw error;
    }
}

export async function logContributionOnChain(userAddress: string, type: string, points: number) {
    if (!process.env.ADMIN_PRIVATE_KEY) {
        console.error("ADMIN_PRIVATE_KEY not found");
        return;
    }

    try {
        const account = privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY as `0x${string}`);
        const client = createWalletClient({
            account,
            chain,
            transport: http()
        });
        const publicClient = createPublicClient({
            chain,
            transport: http()
        });

        console.log(`Logging contribution for ${userAddress}: ${type} (${points} points)...`);
        const hash = await client.writeContract({
            address: CONTRACT_ADDRESSES.performanceTracker,
            abi: PERFORMANCE_TRACKER_ABI,
            functionName: 'logContribution',
            args: [userAddress as `0x${string}`, type, BigInt(points)]
        });

        await publicClient.waitForTransactionReceipt({ hash });
        console.log(`Contribution logged! Tx Hash: ${hash}`);
        return hash;
    } catch (error) {
        console.error("Error logging contribution on-chain:", error);
        return null;
    }
}

export async function mintBadgeOnChain(userAddress: string, name: string, description: string, milestone: string) {
    if (!process.env.ADMIN_PRIVATE_KEY) {
        console.error("ADMIN_PRIVATE_KEY not found");
        return;
    }

    try {
        const account = privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY as `0x${string}`);
        const client = createWalletClient({
            account,
            chain,
            transport: http()
        });
        const publicClient = createPublicClient({
            chain,
            transport: http()
        });

        console.log(`Minting badge '${name}' for ${userAddress}...`);
        const hash = await client.writeContract({
            address: CONTRACT_ADDRESSES.badgeNFT,
            abi: BADGE_NFT_ABI,
            functionName: 'mintBadge',
            args: [userAddress as `0x${string}`, name, description, milestone]
        });

        await publicClient.waitForTransactionReceipt({ hash });
        console.log(`Badge minted! Tx Hash: ${hash}`);
        return hash;
    } catch (error) {
        console.error("Error minting badge on-chain:", error);
        throw error;
    }
}
