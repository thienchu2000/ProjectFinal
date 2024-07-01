const dotenv = require("dotenv");
dotenv.config();
const { Web3 } = require("web3");
const httpProvider = new Web3.providers.HttpProvider(process.env.infuraTest);
const web3 = new Web3(httpProvider);

async function processRequest(txhash) {
  const maxRetries = 120;
  const retryInterval = 5000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const receipt = await web3.eth.getTransactionReceipt(txhash);
      if (receipt) {
        if (receipt.status) {
          const transferEvent = receipt.logs.find(
            (log) =>
              log.topics[0] ===
              web3.utils.sha3("Transfer(address,address,uint256)")
          );
          if (transferEvent) {
            console.log("ERC20 Transfer event found:", transferEvent);
            return receipt;
          } else {
            console.error("Transfer event not found in the transaction logs");
          }
        } else {
          console.error("Transaction failed");
        }
        break;
      }
    } catch (error) {
      console.error("Error fetching transaction receipt:", error);
    }
    await new Promise((resolve) => setTimeout(resolve, retryInterval));
  }
  throw new Error(
    "Transaction receipt not found or failed after multiple retries"
  );
}

module.exports = processRequest;
