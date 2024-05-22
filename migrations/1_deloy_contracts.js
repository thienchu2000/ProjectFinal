const MiChuToken = artifacts.require("MiChuToken");

module.exports = function (deployer) {
  deployer.deploy(MiChuToken);
};
