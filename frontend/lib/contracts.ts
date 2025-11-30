import contracts from "./contracts.json";

// Contract addresses from deployment
export const CONTRACT_ADDRESSES = {
	performanceTracker: (process.env.NEXT_PUBLIC_PERFORMANCE_TRACKER_ADDRESS ||
		contracts.performanceTracker) as `0x${string}`,
	rewardPool: (process.env.NEXT_PUBLIC_REWARD_POOL_ADDRESS ||
		contracts.rewardPool) as `0x${string}`,
	badgeNFT: (process.env.NEXT_PUBLIC_BADGE_NFT_ADDRESS || contracts.badgeNFT) as `0x${string}`,
	celoToken: (process.env.NEXT_PUBLIC_CELO_TOKEN_ADDRESS || contracts.celoToken) as `0x${string}`,
};

// Updated ABIs to match deployed contracts
export const PERFORMANCE_TRACKER_ABI = [
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address",
			},
			{
				internalType: "string",
				name: "contributionType",
				type: "string",
			},
			{
				internalType: "uint256",
				name: "points",
				type: "uint256",
			},
		],
		name: "logContribution",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address",
			},
		],
		name: "getUserPoints",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address",
			},
		],
		name: "getUserContributions",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "user",
						type: "address",
					},
					{
						internalType: "string",
						name: "contributionType",
						type: "string",
					},
					{
						internalType: "uint256",
						name: "points",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "timestamp",
						type: "uint256",
					},
				],
				internalType: "struct PerformanceTracker.Contribution[]",
				name: "",
				type: "tuple[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
] as const;

export const REWARD_POOL_ABI = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_rewardToken",
				type: "address",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "addReward",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "addPrizePool",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "rewardIndex",
				type: "uint256",
			},
		],
		name: "claimReward",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "getContractBalance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address",
			},
		],
		name: "getUserRewards",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "user",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "timestamp",
						type: "uint256",
					},
					{
						internalType: "bool",
						name: "claimed",
						type: "bool",
					},
				],
				internalType: "struct RewardPool.Reward[]",
				name: "",
				type: "tuple[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
] as const;

export const BADGE_NFT_ABI = [
	{
		inputs: [],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				internalType: "string",
				name: "name",
				type: "string",
			},
			{
				internalType: "string",
				name: "description",
				type: "string",
			},
			{
				internalType: "string",
				name: "milestone",
				type: "string",
			},
		],
		name: "mintBadge",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256",
			},
		],
		name: "getBadge",
		outputs: [
			{
				components: [
					{
						internalType: "string",
						name: "name",
						type: "string",
					},
					{
						internalType: "string",
						name: "description",
						type: "string",
					},
					{
						internalType: "string",
						name: "milestone",
						type: "string",
					},
					{
						internalType: "uint256",
						name: "earnedAt",
						type: "uint256",
					},
				],
				internalType: "struct BadgeNFT.Badge",
				name: "",
				type: "tuple",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address",
			},
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
] as const;
