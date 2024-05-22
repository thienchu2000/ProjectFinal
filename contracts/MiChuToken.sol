// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract MiChuToken is ERC20 {
    mapping(address => uint256) public payments;

    constructor() ERC20("MiChuToken", "MCTK") {
        _mint(msg.sender, 10000000000000 * 10 ** 18);
    }

    function totalSupply() public view override returns (uint256) {
        return ERC20.totalSupply();
    }

    function balanceOf(address account) public view override returns (uint256) {
        return ERC20.balanceOf(account);
    }

    function transfer(
        address to,
        uint256 value
    ) public override returns (bool) {
        payments[to] += value;
        return ERC20.transfer(to, value);
    }

    function allowance(
        address owner,
        address spender
    ) public view override returns (uint256) {
        return ERC20.allowance(owner, spender);
    }

    function approve(
        address spender,
        uint256 value
    ) public override returns (bool) {
        return ERC20.approve(spender, value);
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public override returns (bool) {
        payments[to] += value;
        return ERC20.transferFrom(from, to, value);
    }
}
