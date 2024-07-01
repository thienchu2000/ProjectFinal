const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  contracts_build_directory: path.join(__dirname, "src/contracts"),

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
    },

    sepolia: {
      provider: () =>
        new HDWalletProvider(process.env.kya, process.env.alchemyTest),
      network_id: 11155111,
      confirmations: 10,
      timeoutBlocks: 30000,
      skipDryRun: true,
      gas: 4000000,
      networkCheckTimeout: 5000000,
    },

    moonbeam: {
      provider: () =>
        new HDWalletProvider(
          process.env.privateKey,
          "https://rpc.api.moonbeam.network"
        ),
      network_id: 1284,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.25",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },

        evmVersion: "london",
      },
    },
  },
};
