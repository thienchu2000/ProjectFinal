const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { Web3 } = require("web3");
const httpProvider = new Web3.providers.HttpProvider(process.env.infura);
const web3 = new Web3(httpProvider);

const AbiContract = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    type: "function",
  },
];

async function trendingTokens(SmartContracts) {
  const result = [];
  const keyEther = process.env.KEY_ETHER;

  for (const contract of SmartContracts) {
    try {
      const apiCheckEther = await axios.get(
        `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contract.CA}&apikey=${keyEther}`
      );

      const contractData = apiCheckEther.data.result[0];
      const contractName = contractData.ContractName;
      const sourceCode = contractData.SourceCode;

      const contractInstance = new web3.eth.Contract(AbiContract, contract.CA);

      const name = await contractInstance.methods.name().call();
      const symbol = await contractInstance.methods.symbol().call();
      const owner = await contractInstance.methods.owner().call();
      const totalSupply = await contractInstance.methods.totalSupply().call();
      const formattedTotalSupply = web3.utils.fromWei(
        totalSupply.toString(),
        "ether"
      );

      const contractInfo = {
        SmartContract: contract.CA,
        NameToken: name,
        SymbolToken: symbol,
        TotalSupply: `${formattedTotalSupply} ${symbol}`,
        Ownership:
          owner === "0x0000000000000000000000000000000000000000"
            ? "Renounce Ownership"
            : "Ownership has not been relinquished",
        Ownable: sourceCode.includes("Ownable")
          ? "has a special close-up function"
          : "don't see function Ownable",
        FunctionMin: sourceCode.includes("_mint")
          ? "Min Token have dump"
          : "Can't function Min token",
      };

      let sumTotal = 0;
      if (contractInfo.Ownership === "Ownership has not been relinquished")
        sumTotal += 30;
      if (contractInfo.Ownable === "has a special close-up function")
        sumTotal += 15;
      if (contractInfo.FunctionMin === "Min Token have dump") sumTotal += 15;

      contractInfo.SumTotalScammer = sumTotal;

      result.push(contractInfo);
    } catch (e) {
      console.error(`Error processing contract ${contract.CA}:`, e.message);
    }
  }

  return result;
}

module.exports = trendingTokens;
