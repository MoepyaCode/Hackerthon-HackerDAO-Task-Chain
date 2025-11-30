// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PerformanceTracker {
    struct Contribution {
        address user;
        string contributionType; // "issue", "pr", "commit"
        uint256 points;
        uint256 timestamp;
    }

    mapping(address => uint256) public userPoints;
    mapping(address => Contribution[]) public userContributions;
    Contribution[] public allContributions;

    event ContributionLogged(address indexed user, string contributionType, uint256 points, uint256 timestamp);

    function logContribution(address user, string memory contributionType, uint256 points) external {
        userPoints[user] += points;
        Contribution memory newContribution = Contribution(user, contributionType, points, block.timestamp);
        userContributions[user].push(newContribution);
        allContributions.push(newContribution);
        emit ContributionLogged(user, contributionType, points, block.timestamp);
    }

    function getUserPoints(address user) external view returns (uint256) {
        return userPoints[user];
    }

    function getUserContributions(address user) external view returns (Contribution[] memory) {
        return userContributions[user];
    }

    function getLeaderboard() external view returns (address[] memory, uint256[] memory) {
        // Simple implementation - in production, use a more efficient data structure
        address[] memory users = new address[](allContributions.length);
        uint256[] memory points = new uint256[](allContributions.length);
        uint256 uniqueCount = 0;

        for (uint256 i = 0; i < allContributions.length; i++) {
            address user = allContributions[i].user;
            bool found = false;
            for (uint256 j = 0; j < uniqueCount; j++) {
                if (users[j] == user) {
                    points[j] += allContributions[i].points;
                    found = true;
                    break;
                }
            }
            if (!found) {
                users[uniqueCount] = user;
                points[uniqueCount] = allContributions[i].points;
                uniqueCount++;
            }
        }

        // Sort by points (simple bubble sort for demo)
        for (uint256 i = 0; i < uniqueCount - 1; i++) {
            for (uint256 j = 0; j < uniqueCount - i - 1; j++) {
                if (points[j] < points[j + 1]) {
                    (users[j], users[j + 1]) = (users[j + 1], users[j]);
                    (points[j], points[j + 1]) = (points[j + 1], points[j]);
                }
            }
        }

        return (users, points);
    }
}