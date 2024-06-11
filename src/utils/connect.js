const dotenv = require("dotenv");
dotenv.config();
const { Web3 } = require("web3");
const httpProvider = new Web3.providers.HttpProvider(process.env.infuraTest);
const web3 = new Web3(httpProvider);

async function processRequest(txhash) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const dattaTransaction = await web3.eth.getTransactionReceipt(
          `${txhash}`
        );
        return resolve(dattaTransaction);
      } catch (error) {
        reject(error);
      }
    }, 50000);
  });
}

module.exports = processRequest;
