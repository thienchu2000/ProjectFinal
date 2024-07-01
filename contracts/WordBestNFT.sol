// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WordBestNFT_one1 is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    constructor(
        address initialOwner
    ) ERC721("WordBestNFT_one1", "WB") Ownable(initialOwner) {}

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

    function mintByOwner(
        address to,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _nextTokenId++;

        return tokenId;
    }
}
