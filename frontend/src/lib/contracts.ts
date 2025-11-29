import { ethers } from "ethers";

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

// Contract ABIs
export const PERFORMANCE_TRACKER_ABI = [
	"function logContribution(address user, string memory contributionType, uint256 points) external",
	"function getUserPoints(address user) external view returns (uint256)",
	"function getUserContributions(address user) external view returns (tuple(address user, string contributionType, uint256 points, uint256 timestamp)[] memory)",
	"function getLeaderboard() external view returns (address[] memory, uint256[] memory)",
	"event ContributionLogged(address indexed user, string contributionType, uint256 points, uint256 timestamp)",
];

export const REWARD_POOL_ABI = [
	"function addReward(address user, uint256 amount) external",
	"function claimReward() external",
	"function addPrizePool(uint256 amount) external",
	"function getUserRewards(address user) external view returns (uint256)",
	"function getPrizePool() external view returns (uint256)",
	"event RewardAdded(address indexed user, uint256 amount)",
	"event RewardClaimed(address indexed user, uint256 amount)",
];

export const BADGE_NFT_ABI = [
	"function mintBadge(address to, string memory badgeType) external returns (uint256)",
	"function tokenURI(uint256 tokenId) external view returns (string memory)",
	"function getBadgeType(uint256 tokenId) external view returns (string memory)",
	"function balanceOf(address owner) external view returns (uint256)",
	"function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
	"event BadgeMinted(address indexed to, uint256 indexed tokenId, string badgeType)",
];

// Contract addresses (will be populated after deployment)
export const CONTRACT_ADDRESSES = {
	alfajores: {
		performanceTracker: "",
		rewardPool: "",
		badgeNFT: "",
		celoToken: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9",
	},
	celoSepolia: {
		performanceTracker: "",
		rewardPool: "",
		badgeNFT: "",
		celoToken: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9", // Same as Alfajores for testnet
	},
	celo: {
		performanceTracker: "",
		rewardPool: "",
		badgeNFT: "",
		celoToken: "0x471EcE3750Da237f93B8E339c536989b8978a438",
	},
};

// Contract interaction utilities
export class ContractService {
	private provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
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
	getPerformanceTracker(network: "alfajores" | "celoSepolia" | "celo" = "alfajores") {
		const address = CONTRACT_ADDRESSES[network].performanceTracker;
		return new ethers.Contract(address, PERFORMANCE_TRACKER_ABI, this.signer || this.provider);
	}

	// Reward Pool Contract
	getRewardPool(network: "alfajores" | "celoSepolia" | "celo" = "alfajores") {
		const address = CONTRACT_ADDRESSES[network].rewardPool;
		return new ethers.Contract(address, REWARD_POOL_ABI, this.signer || this.provider);
	}

	// Badge NFT Contract
	getBadgeNFT(network: "alfajores" | "celoSepolia" | "celo" = "alfajores") {
		const address = CONTRACT_ADDRESSES[network].badgeNFT;
		return new ethers.Contract(address, BADGE_NFT_ABI, this.signer || this.provider);
	}

	// CELO Token Contract
	getCeloToken(network: "alfajores" | "celoSepolia" | "celo" = "alfajores") {
		const address = CONTRACT_ADDRESSES[network].celoToken;
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
