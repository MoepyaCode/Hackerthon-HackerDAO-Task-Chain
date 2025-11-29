const { ethers } = require("hardhat");

async function main() {
	// Deploy PerformanceTracker
	const PerformanceTracker = await ethers.getContractFactory("PerformanceTracker");
	const performanceTracker = await PerformanceTracker.deploy();
	await performanceTracker.deployed();
	console.log("PerformanceTracker deployed to:", performanceTracker.address);

	// For RewardPool, we need the CELO token address
	// On Celo mainnet: 0x471EcE3750Da237f93B8E339c536989b8978a438
	// On Alfajores: 0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9
	const celoTokenAddress =
		network.name === "celo"
			? "0x471EcE3750Da237f93B8E339c536989b8978a438"
			: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9";

	const RewardPool = await ethers.getContractFactory("RewardPool");
	const rewardPool = await RewardPool.deploy(celoTokenAddress);
	await rewardPool.deployed();
	console.log("RewardPool deployed to:", rewardPool.address);

	// Deploy BadgeNFT
	const BadgeNFT = await ethers.getContractFactory("BadgeNFT");
	const badgeNFT = await BadgeNFT.deploy();
	await badgeNFT.deployed();
	console.log("BadgeNFT deployed to:", badgeNFT.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
