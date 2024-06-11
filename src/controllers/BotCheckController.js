const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { Web3 } = require("web3");
const httpProvider = new Web3.providers.HttpProvider(process.env.infura);
const web3 = new Web3(httpProvider);
const Bots = require("../models/Bots");
const DataSmartContract = require("../models/DataSmartContract");

class BotCheckController {
  async index(req, res, next) {
    const check = req.user;
    const checkRole = check.Role.NameRole;
    var admin;
    var manager;
    if (checkRole === "Admin") {
      admin = true;
    } else {
      admin = false;
    }
    if (checkRole === "Manager") {
      manager = true;
    } else {
      manager = false;
    }
    res.render("botCheck", {
      User: true,
      Name: check.UserName,
      _id: check._id,
      manager: manager,
      admin: admin,
      Image: check.Image,
      back: "https://static.vecteezy.com/system/resources/previews/023/995/943/large_2x/ethereum-coin-symbol-with-blue-light-background-network-connection-by-generative-ai-free-photo.jpg",
    });
  }
  async check(req, res, next) {
    const { smartContract } = req.body;
    var result = [];
    if (smartContract.length < 42 || smartContract.length > 42) {
      return res.status(401).send("Smart contracts must be 42 characters long");
    }
    if (smartContract) {
      result.push({ SmartContract: smartContract });
    }
    var keyEther = process.env.keyEther;
    const check = req.user;
    const checkRole = check.Role.NameRole;
    var admin;
    var manager;
    if (checkRole === "Admin") {
      admin = true;
    } else {
      admin = false;
    }
    if (checkRole === "Manager") {
      manager = true;
    } else {
      manager = false;
    }
    try {
      let apiCheckEther = await axios.get(
        `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${smartContract}&apikey=${keyEther}`
      );
      var doneCall = apiCheckEther.data;
      var checkSourceCode = doneCall.result.map((item) => {
        return item.SourceCode;
      });
      var findData = doneCall.result.map((item) => {
        return item.ContractName;
      });
      var AbiContract = [
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
        // {
        //   constant: true,
        //   inputs: [
        //     {
        //       name: "_to",
        //       type: "address",
        //     },
        //     {
        //       name: "_value",
        //       type: "uint256",
        //     },
        //   ],
        //   name: "transfer",
        //   outputs: [
        //     {
        //       name: "",
        //       type: "bool",
        //     },
        //   ],
        //   payable: false,
        //   stateMutability: "nonpayable",
        //   type: "function",
        // },
      ];

      var contract = new web3.eth.Contract(AbiContract, smartContract);
      var nameAbi = await contract.methods.name().call();
      if (nameAbi) {
        result.push({ NameToken: nameAbi });
      }
      var symbolAbi = await contract.methods.symbol().call();
      if (symbolAbi) {
        result.push({ SymbolToken: symbolAbi });
      }
      var ownerAbi = await contract.methods.owner().call();
      var totalSupply = await contract.methods.totalSupply().call();
      var coverTotalSupply = web3.utils.fromWei(
        totalSupply.toString(),
        "ether"
      );
      var getTotalSupply = web3.utils.toWei(coverTotalSupply, "ether");
      if (getTotalSupply) {
        result.push({ TotalSupply: `${getTotalSupply} ${symbolAbi} ` });
      }
      if (ownerAbi === "0x0000000000000000000000000000000000000000") {
        result.push({ Renounce: "Renounce Ownership" });
      } else {
        result.push({
          NoRenounce: "Ownership has not been relinquished by scammers",
        });
      }
      for (var i = 0; i < checkSourceCode.length; i++) {
        if (checkSourceCode[i].includes("Ownable")) {
          result.push({
            Ownable: "has a special close-up function",
          });
        } else {
          result.push({ NoOwnable: "done't see function Ownable" });
        }
      }

      for (var i = 0; i < checkSourceCode.length; i++) {
        if (checkSourceCode[i].includes("_mint")) {
          result.push({ FunctionMin: "Min Token have dump" });
        } else {
          result.push({ NoFunctionMin: "Can't function Min token " });
        }
      }
      var SumTotal = 0;
      for (var i = 0; i < result.length; i++) {
        if (result[i].NoRenounce) {
          SumTotal += 30;
        }
        if (result[i].Ownable) {
          SumTotal += 15;
        }
        if (result[i].FunctionMin) {
          SumTotal += 15;
        }
      }
      if (SumTotal) {
        result.push({ SumTotalScammer: SumTotal });
      }
      var dataSmartContract = new DataSmartContract({
        SmartContract: smartContract,
      });
      dataSmartContract.save();
      res.render("botCheck", {
        User: true,
        Name: check.UserName,
        _id: check._id,
        manager: manager,
        admin: admin,
        Image: check.Image,
        back: "https://static.vecteezy.com/system/resources/previews/023/995/943/large_2x/ethereum-coin-symbol-with-blue-light-background-network-connection-by-generative-ai-free-photo.jpg",
        result: result,
      });
    } catch (err) {
      res.send("error");
    }
  }
}
module.exports = new BotCheckController();
