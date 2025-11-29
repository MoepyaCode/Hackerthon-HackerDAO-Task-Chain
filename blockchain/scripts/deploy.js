const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
	const network = await ethers.provider.getNetwork();
	console.log(`Deploying to network: ${network.name}`);

	// Deploy PerformanceTracker
	console.log("Deploying PerformanceTracker...");
	const PerformanceTracker = await ethers.getContractFactory("PerformanceTracker");
	const performanceTracker = await PerformanceTracker.deploy();
	await performanceTracker.deployed();
	console.log("✅ PerformanceTracker deployed to:", performanceTracker.address);

	// For RewardPool, we need the CELO token address
	// On Celo mainnet: 0x471EcE3750Da237f93B8E339c536989b8978a438
	// On Alfajores: 0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9
	const celoTokenAddress =
		network.name === "celo"
			? "0x471EcE3750Da237f93B8E339c536989b8978a438"
			: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9";

	console.log("Deploying RewardPool...");
	const RewardPool = await ethers.getContractFactory("RewardPool");
	const rewardPool = await RewardPool.deploy(celoTokenAddress);
	await rewardPool.deployed();
	console.log("✅ RewardPool deployed to:", rewardPool.address);

	// Deploy BadgeNFT
	console.log("Deploying BadgeNFT...");
	const BadgeNFT = await ethers.getContractFactory("BadgeNFT");
	const badgeNFT = await BadgeNFT.deploy();
	await badgeNFT.deployed();
	console.log("✅ BadgeNFT deployed to:", badgeNFT.address);

	// Save contract addresses
	const contracts = {
		network: network.name,
		performanceTracker: performanceTracker.address,
		rewardPool: rewardPool.address,
		badgeNFT: badgeNFT.address,
		celoToken: celoTokenAddress,
		deployedAt: new Date().toISOString(),
	};

	const outputDir = path.join(__dirname, "../deployments");
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir);
	}

	const outputPath = path.join(outputDir, `${network.name}.json`);
	fs.writeFileSync(outputPath, JSON.stringify(contracts, null, 2));
	console.log(`📄 Contract addresses saved to: ${outputPath}`);

	// Also save to frontend config
	const frontendConfigPath = path.join(__dirname, "../../frontend/src/lib/contracts.json");
	fs.writeFileSync(frontendConfigPath, JSON.stringify(contracts, null, 2));
	console.log(`📄 Frontend config updated: ${frontendConfigPath}`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
