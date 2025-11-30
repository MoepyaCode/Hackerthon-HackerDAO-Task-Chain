// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BadgeNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Badge {
        string name;
        string description;
        string milestone;
        uint256 earnedAt;
    }

    mapping(uint256 => Badge) public badges;

    event BadgeMinted(address indexed to, uint256 tokenId, string milestone);

    constructor() ERC721("TaskChain Badge", "TCB") {}

    function mintBadge(
        address to,
        string memory name,
        string memory description,
        string memory milestone
    ) external onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(to, tokenId);
        badges[tokenId] = Badge(name, description, milestone, block.timestamp);
        emit BadgeMinted(to, tokenId, milestone);
    }

    function getBadge(uint256 tokenId) external view returns (Badge memory) {
        return badges[tokenId];
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        // Simple on-chain metadata
        Badge memory badge = badges[tokenId];
        string memory json = string(
            abi.encodePacked(
                '{"name": "',
                badge.name,
                '", "description": "',
                badge.description,
                '", "milestone": "',
                badge.milestone,
                '", "earnedAt": "',
                uint2str(badge.earnedAt),
                '"}'
            )
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    base64Encode(bytes(json))
                )
            );
    }

    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function base64Encode(
        bytes memory data
    ) internal pure returns (string memory) {
        // Simplified base64 for demo - in production use a proper library
        return "base64encodedstring";
    }
}
