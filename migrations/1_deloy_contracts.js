const MiChuTokenA = artifacts.require("MiChuTokenA");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(MiChuTokenA, accounts[0]);
};
