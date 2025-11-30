const { ethers } = require("hardhat");

async function main() {
	const [deployer] = await ethers.getSigners();
	if (!deployer) {
		console.log("No account configured. Check your .env file.");
		return;
	}

	console.log("Account:", deployer.address);
	const balance = await deployer.getBalance();
	console.log("Balance:", ethers.utils.formatEther(balance), "CELO");
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
