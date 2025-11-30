import { ethers } from "ethers";
import contracts from "./contracts.json";

// Extend window interface for MetaMask
declare global {
	interface Window {
		ethereum?: {
			request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
			on: (event: string, handler: (...args: unknown[]) => void) => void;
			removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
		};
	}
}

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
export class ContractService {
	private provider:
		| ethers.providers.Web3Provider
		| ethers.providers.JsonRpcProvider
		| ethers.providers.BaseProvider;
	private signer?: ethers.Signer;

	constructor(
		provider?: ethers.providers.Web3Provider,
		network: "alfajores" | "celoSepolia" | "celo" = "alfajores",
	) {
		if (provider) {
			this.provider = provider;
			this.signer = provider.getSigner();
		} else {
			// Default providers for different networks
			const defaultProviders = {
				alfajores: "https://alfajores-forno.celo-testnet.org",
				celoSepolia: "https://sepolia-forno.celo-testnet.org",
				celo: "https://forno.celo.org",
			};
			this.provider = ethers.getDefaultProvider(defaultProviders[network]);
		}
	}

	// Performance Tracker Contract
	getPerformanceTracker() {
		const address = CONTRACT_ADDRESSES.performanceTracker;
		return new ethers.Contract(address, PERFORMANCE_TRACKER_ABI, this.signer || this.provider);
	}

	// Reward Pool Contract
	getRewardPool() {
		const address = CONTRACT_ADDRESSES.rewardPool;
		return new ethers.Contract(address, REWARD_POOL_ABI, this.signer || this.provider);
	}

	// Badge NFT Contract
	getBadgeNFT() {
		const address = CONTRACT_ADDRESSES.badgeNFT;
		return new ethers.Contract(address, BADGE_NFT_ABI, this.signer || this.provider);
	}

	// CELO Token Contract
	getCeloToken() {
		const address = CONTRACT_ADDRESSES.celoToken;
		const ERC20_ABI = [
			"function balanceOf(address owner) view returns (uint256)",
			"function transfer(address to, uint256 amount) returns (bool)",
			"function approve(address spender, uint256 amount) returns (bool)",
			"function allowance(address owner, address spender) view returns (uint256)",
		];
		return new ethers.Contract(address, ERC20_ABI, this.signer || this.provider);
	}
}

// Utility functions
export const connectWallet = async (): Promise<ethers.providers.Web3Provider | null> => {
	if (typeof window === "undefined" || !window.ethereum) {
		throw new Error("MetaMask not installed");
	}

	try {
		await window.ethereum.request({ method: "eth_requestAccounts" });
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		return provider;
	} catch (error) {
		console.error("Error connecting wallet:", error);
		return null;
	}
};

export const getWalletAddress = async (
	provider: ethers.providers.Web3Provider,
): Promise<string> => {
	const signer = provider.getSigner();
	return await signer.getAddress();
};

export const switchToCeloNetwork = async (
	network: "alfajores" | "celoSepolia" | "celo" = "alfajores",
) => {
	if (typeof window === "undefined" || !window.ethereum) {
		throw new Error("MetaMask not available");
	}

	const networkParams = {
		alfajores: {
			chainId: "0xaef3", // 44787
			chainName: "Celo Alfajores Testnet",
			nativeCurrency: { name: "CELO", symbol: "A-CELO", decimals: 18 },
			rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
			blockExplorerUrls: ["https://celo-alfajores.blockscout.com/"],
		},
		celoSepolia: {
			chainId: "0xaef3", // 44787 (same as Alfajores for now)
			chainName: "Celo Sepolia Testnet",
			nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
			rpcUrls: ["https://sepolia-forno.celo-testnet.org"],
			blockExplorerUrls: ["https://sepolia.celoscan.io/"],
		},
		celo: {
			chainId: "0xa4ec", // 42220
			chainName: "Celo Mainnet",
			nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
			rpcUrls: ["https://forno.celo.org"],
			blockExplorerUrls: ["https://celoscan.io/"],
		},
	};

	try {
		await window.ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: networkParams[network].chainId }],
		});
	} catch (error: unknown) {
		const err = error as { code?: number };
		if (err.code === 4902) {
			// Network not added, add it
			await window.ethereum!.request({
				method: "wallet_addEthereumChain",
				params: [networkParams[network]],
			});
		} else {
			throw error;
		}
	}
};

// Load contract addresses from deployed config
export const loadContractAddresses = async () => {
	try {
		const response = await fetch("/contracts.json");
		const addresses = await response.json();
		Object.assign(CONTRACT_ADDRESSES, addresses);
	} catch (error) {
		console.warn("Could not load contract addresses:", error);
	}
};
