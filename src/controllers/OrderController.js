const Bots = require("../models/Bots");
const Orders = require("../models/Orders");
const Payments = require("../models/Payments");
const dotenv = require("dotenv");
const { Web3 } = require("web3");
const httpProvider = new Web3.providers.HttpProvider(process.env.infuraTest);
const web3 = new Web3(httpProvider);
const AbiToken = require("../contracts/ThienChuToken.json");
const axios = require("axios");
const { Core } = require("@quicknode/sdk");

class OrderController {
  async index(req, res, next) {
    const info = req.user;
    try {
      const query = await Bots.find({});
      res.render("order", {
        User: true,
        info: info,
        Name: info.UserName,
        query: query,
        back: "https://static.vecteezy.com/system/resources/previews/023/995/943/large_2x/ethereum-coin-symbol-with-blue-light-background-network-connection-by-generative-ai-free-photo.jpg",
      });
    } catch (Error) {
      return res.status(500).send({ message: "Error" });
    }
  }
  async payment(req, res, next) {
    const user = req.user;

    const { productId, userAddress } = req.body;
    console.log(req.body);

    const SmartContractAddress = "0xBB1Ae18020520Eb943D26cAe21551d6C9Fb5de62";
    const transaction = await axios.post(`${process.env.infuraTest}`);

    //     curl --request POST \
    //     --url https://eth-mainnet.g.alchemy.com/v2/docs-demo \
    //     --header 'accept: application/json' \
    //     --header 'content-type: application/json' \
    //     --data '
    // {
    //  "id": 1,
    //  "jsonrpc": "2.0",
    //  "method": "eth_getTransactionByHash",
    //  "params": [
    //    "0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"
    //  ]
    // }
    // '

    const request = {
      jsonrpc: "2.0",
      methods: "eth_getTransactionByHash",
      params: [SmartContractAddress],
      id: 1,
    };

    const response = await axios.post(transaction, request, {
      headers: "Content-Type: application/json",
    });

    console.log(response);

    const contract = new web3.eth.Contract(AbiToken.abi, SmartContractAddress);

    var checkaddress = await contract.methods.totalSupply().call();
    var name = await contract.methods.name().call();
    // var payments = await contract.methods.payments().call();
    var sym = await contract.methods.symbol().call();
    // var amout;
    // if (payments === undefined || payments === null) {
    //   amout = "1";
    // } else {
    //   amout = payments;
    // }
  }
}

module.exports = new OrderController();
