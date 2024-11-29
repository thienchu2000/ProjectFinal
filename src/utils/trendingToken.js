const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { Web3 } = require("web3");
const httpProvider = new Web3.providers.HttpProvider(process.env.infura);
const web3 = new Web3(httpProvider);
const Crawler = require("crawler");
const cheerio = require("cheerio");

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

async function connectCaler(io) {
  try {
    const c = new Crawler({
      maxConnections: 10,
      callback: async (error, resCrawler, done) => {
        if (error) {
          console.error(error);
        } else {
          const html = resCrawler.body;
          const $ = cheerio.load(html);
          const data = $(
            ".tgme_widget_message_wrap.js-widget_message_wrap"
          ).text();
          const Arr = data.split(/[,\s]+/);
          const tokenInfo = [];
          let tempCA = "";

          for (let i = 0; i < Arr.length; i++) {
            if (Arr[i].startsWith("0x")) {
              tempCA = Arr[i];
              if (tempCA) {
                tokenInfo.push({ CA: tempCA });
              }
            }
          }

          let clearToken = tokenInfo.map((item) => {
            return {
              CA: item.CA.split("Supply:")[0]
                .split("This")[0]
                .split("🔗")[0]
                .trim(),
            };
          });

          const SmartContracts = clearToken.filter(
            (item) => item.CA.length === 42
          );

          if (Array.isArray(SmartContracts)) {
            try {
              const doneok = await trendingTokens(SmartContracts);

              io.emit("onchain", doneok);
            } catch (err) {
              console.error("Error processing tokens:", err);
            }
          } else {
            console.error("doneToken is not an array");
          }
        }
        done();
      },
    });

    c.queue("https://t.me/s/iTokenEthereum");
  } catch (err) {
    console.error(err);
  }
}

async function trendingTokens(SmartContracts) {
  const keyEther = process.env.KEY_ETHER;
  const result = [];

  if (!Array.isArray(SmartContracts)) {
    throw new TypeError("SmartContracts is not iterable");
  }

  // for (const contract of SmartContracts) {
  //   try {
  //     const apiCheckEther = await axios.get(
  //       `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contract.CA}&apikey=${keyEther}`
  //     );

  //     const contractData = apiCheckEther.data.result[0];
  //     const sourceCode = contractData.SourceCode;
  //     const contractInstance = new web3.eth.Contract(AbiContract, contract.CA);
  //     const name = await contractInstance.methods.name().call();
  //     const symbol = await contractInstance.methods.symbol().call();
  //     const owner = await contractInstance.methods.owner().call();
  //     const totalSupply = await contractInstance.methods.totalSupply().call();
  //     const formattedTotalSupply = web3.utils.fromWei(
  //       totalSupply.toString(),
  //       "ether"
  //     );

  //     const contractInfo = {
  //       SmartContract: contract.CA,
  //       NameToken: name,
  //       SymbolToken: symbol,
  //       TotalSupply: `${formattedTotalSupply} ${symbol}`,
  //       Ownership:
  //         owner === "0x0000000000000000000000000000000000000000"
  //           ? "Renounce Ownership"
  //           : "Ownership has not been relinquished",
  //       Ownable: sourceCode.includes("Ownable")
  //         ? "has a special close-up function"
  //         : "don't see function Ownable",
  //       FunctionMin: sourceCode.includes("_mint")
  //         ? "Min Token have dump"
  //         : "Can't function Min token",
  //     };

  //     let sumTotal = 0;
  //     if (contractInfo.Ownership === "Ownership has not been relinquished")
  //       sumTotal += 30;
  //     if (contractInfo.Ownable === "has a special close-up function")
  //       sumTotal += 15;
  //     if (contractInfo.FunctionMin === "Min Token have dump") sumTotal += 15;

  //     contractInfo.SumTotalScammer = sumTotal;

  //     result.push(contractInfo);
  //     console.log(contractInfo);
  //   } catch (e) {
  //     console.error(`Error processing contract ${contract.CA}:`, e.message);
  //   }
  // }

  for (const contract of SmartContracts) {
    try {
      const apiCheckEther = await axios.get(
        `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contract.CA}&apikey=${keyEther}`
      );

      const contractData = apiCheckEther.data.result[0];
      const sourceCode = contractData.SourceCode || "";

      const contractInstance = new web3.eth.Contract(AbiContract, contract.CA);

      let name = "Unknown",
        symbol = "Unknown",
        owner = "Unknown",
        totalSupply = "0";

      try {
        name = await contractInstance.methods.name().call();
        symbol = await contractInstance.methods.symbol().call();
        owner = await contractInstance.methods.owner().call();
        totalSupply = await contractInstance.methods.totalSupply().call();
      } catch (err) {
        console.error(
          `Error calling contract methods for ${contract.CA}:`,
          err.message
        );
      }

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
  console.log(result);
  return result;
}

module.exports = { connectCaler, trendingTokens };
