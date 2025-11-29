const { expect } = require("chai");

describe("PerformanceTracker", function () {
	let PerformanceTracker, performanceTracker, owner, addr1;

	beforeEach(async function () {
		PerformanceTracker = await ethers.getContractFactory("PerformanceTracker");
		[owner, addr1] = await ethers.getSigners();
		performanceTracker = await PerformanceTracker.deploy();
		await performanceTracker.deployed();
	});

	it("Should log contributions and update points", async function () {
		await performanceTracker.logContribution(addr1.address, "issue", 10);
		expect(await performanceTracker.getUserPoints(addr1.address)).to.equal(10);
	});

	it("Should return user contributions", async function () {
		await performanceTracker.logContribution(addr1.address, "pr", 20);
		const contributions = await performanceTracker.getUserContributions(addr1.address);
		expect(contributions.length).to.equal(1);
		expect(contributions[0].contributionType).to.equal("pr");
		expect(contributions[0].points).to.equal(20);
	});
});
