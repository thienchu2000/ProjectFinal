// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract WordLegendNFT_two is ERC721URIStorage {
    uint256 private _nextTokenId = 1;

    constructor() ERC721("WordLegendNFT_two", "WL") {}

    function awardItem(
        address player,
        string memory tokenURI
    ) public returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _mint(player, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _nextTokenId++;

        return tokenId;
    }
}
