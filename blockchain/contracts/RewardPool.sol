// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardPool is Ownable {
    IERC20 public rewardToken; // CELO or cUSD

    struct Reward {
        address user;
        uint256 amount;
        uint256 timestamp;
        bool claimed;
    }

    mapping(address => Reward[]) public userRewards;
    Reward[] public allRewards;

    event RewardAdded(address indexed user, uint256 amount, uint256 timestamp);
    event RewardClaimed(address indexed user, uint256 amount, uint256 timestamp);

    constructor(address _rewardToken) {
        rewardToken = IERC20(_rewardToken);
    }

    function addReward(address user, uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        userRewards[user].push(Reward(user, amount, block.timestamp, false));
        allRewards.push(Reward(user, amount, block.timestamp, false));
        emit RewardAdded(user, amount, block.timestamp);
    }

    function claimReward(uint256 rewardIndex) external {
        require(rewardIndex < userRewards[msg.sender].length, "Invalid reward index");
        Reward storage reward = userRewards[msg.sender][rewardIndex];
        require(!reward.claimed, "Reward already claimed");
        require(rewardToken.balanceOf(address(this)) >= reward.amount, "Insufficient contract balance");

        reward.claimed = true;
        rewardToken.transfer(msg.sender, reward.amount);
        emit RewardClaimed(msg.sender, reward.amount, block.timestamp);
    }

    function getUserRewards(address user) external view returns (Reward[] memory) {
        return userRewards[user];
    }

    function addPrizePool(uint256 amount) external onlyOwner {
        require(rewardToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }

    function getContractBalance() external view returns (uint256) {
        return rewardToken.balanceOf(address(this));
    }
}