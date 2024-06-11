const Crawler = require("crawler");
const cheerio = require("cheerio");
const axios = require("axios");
const Bots = require("../models/Bots");
const BigMetaData = require("../models/BigMetaData");
const coverData = require("../utils/coverData");
const dotenv = require("dotenv");
dotenv.config();
const { Web3 } = require("web3");
const httpProvider = new Web3.providers.HttpProvider(process.env.infura);
const web3 = new Web3(httpProvider);
const { trendingTokens, connectCaler } = require("../utils/trendingToken");
const setResult = require("../utils/ws");

class BotTrendingController {
  async index(req, res, next) {
    const io = res.io;
    const check = req.user;
    const checkRole = check.Role.NameRole;
    const admin = checkRole === "Admin";
    const manager = checkRole === "Manager";
    try {
      if (check) {
        var settime = setInterval(() => {
          connectCaler(io);
        }, 10000);
        connectCaler(io);
      } else {
        clearInterval(settime);
      }
      res.status(200).render("botTrending", {
        botcheck: true,
        User: true,
        Name: check.UserName,
        manager: manager,
        admin: admin,
        _id: check._id,
        Image: check.Image,
        back: "https://images.contentstack.io/v3/assets/blt38dd155f8beb7337/blt8ccf223eda890b9e/6221f30d25232e3cccc45b91/Ethereum--1068x527.jpeg",
        imgbot: "assets/BotCall.png",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error processing tokens");
    }
  }
  async topPump(req, res, next) {
    try {
      const check = req.user;
      const io = res.io;
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
      setResult(io);
      setInterval(() => {
        setResult(io);
      }, 30000);

      res.status(200).render("trendingOff", {
        call: true,
        User: true,
        Name: check.UserName,
        manager: manager,
        admin: admin,
        _id: check._id,
        Image: check.Image,
        back: "https://uyenuong.net/wp-content/uploads/2022/05/img_628b8fd50646b.jpg",
        imgbot: "assets/BotCall.png",
      });
    } catch (err) {
      console.log(err);
      return res.send("404 Not Found");
    }
  }
}

module.exports = new BotTrendingController();
