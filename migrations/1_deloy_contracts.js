const MiChuETH = artifacts.require("MiChuETH");

module.exports = function (deployer, network, accounts) {
  const initialOwner = accounts[0];
  const buyTax = 0;
  const sellTax = 0;
  const taxWallet = accounts[0];

  deployer.deploy(MiChuETH, initialOwner, buyTax, sellTax, taxWallet);
};

// 0xe5c0b35F8ceA16E225aaA14AaC4a62db4D074e11
