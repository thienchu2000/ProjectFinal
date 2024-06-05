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
const connectToMetamask = require("../utils/connect");
const QRCode = require("qrcode");
const processReques = require("../utils/connect");

class OrderController {
  async index(req, res, next) {
    const info = req.user;
    var checkRole = info.Role.NameRole;
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
      const query = await Bots.find({});
      res.render("order", {
        User: true,
        info: info,
        Name: info.UserName,
        Image: info.Image,
        admin: admin,
        manager: manager,
        query: query,
        back: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG1r5-hNkSEsMkT024GhK6ZdpgzTEE2va7ltY8zbxjgsz1F28tYSm1_wmTsPxiyXAV3uQ&usqp=CAU",
      });
    } catch (Error) {
      return res.status(500).send({ message: "Error" });
    }
  }
  async payment(req, res, next) {
    const user = req.user;
    const { productId, addressUser, txhash } = req.body;
    console.log(req.body);

    const SmartContractAddress = "0xBB1Ae18020520Eb943D26cAe21551d6C9Fb5de62";

    try {
      const dattaTransaction = await processReques(txhash);
      if (dattaTransaction.status === 1n) {
        const payment = new Payments({
          User: user._id,
          Bot: productId,
        });
        const idPay = await payment.save();
        const orders = new Orders({
          User: user._id,
          Bot: productId,
          Payment: idPay._id,
        });
        await orders.save();
        return res.status(200).send("Successfully");
      } else {
        return res.status(404).send("Transaction failed");
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
      return res.status(500).send(error.message);
    }
  }
}

module.exports = new OrderController();
