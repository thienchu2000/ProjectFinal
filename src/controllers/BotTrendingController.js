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
const trendingTokens = require("../utils/trendingToken");
const WebSocket = require("ws");

class BotTrendingController {
  async index(req, res, next) {
    const check = req.user;
    const checkRole = check.Role.NameRole;
    const admin = checkRole === "Admin";
    const manager = checkRole === "Manager";
    res.render("botTrending", {
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
  }
  async get(req, res, next) {
    const check = req.user;
    const checkRole = check.Role.NameRole;
    const admin = checkRole === "Admin";
    const manager = checkRole === "Manager";

    try {
      const c = new Crawler({
        maxConnections: 10,
        callback: async (error, resCrawler, done) => {
          if (error) {
            return res.send(error);
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

            const doneToken = clearToken.filter(
              (item) => item.CA.length === 42
            );

            try {
              clearToken = await trendingTokens(doneToken);
              console.log(clearToken);

              res.json({
                clearToken: clearToken,
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
          done();
        },
      });

      c.queue("https://t.me/s/iTokenEthereum");
    } catch (err) {
      console.log(err);
      return res.status(404).send("Not Found");
    }
  }
  async topPump(req, res, next) {
    const api =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
    try {
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
      const response = await axios.get(api);

      var doneCall = response.data.map((item) => {
        return {
          id: item.id,
          symbol: item.symbol,
          name: item.name,
          image: item.image,
          current_price: item.current_price,
          market_cap_rank: item.market_cap_rank,
          total_volume: item.total_volume,
          last_updated: item.last_updated,
          high_24h: item.high_24h,
          low_24h: item.low_24h,
        };
      });
      let date = new Date();
      let month = date.getMonth() + 1;
      let findDate = date.getDate();
      let findHours = date.getHours();
      if (month === 12 || month === 4 || month === 9) {
        if (findDate === 1 && findHours === 1) {
          const bigMetaData = new BigMetaData({
            BigMetaData: doneCall,
          });
          bigMetaData.save();
        }
      }

      var donecall = doneCall.map((item) => {
        return item.total_volume;
      });

      var callBigMetaData = await BigMetaData.find({});
      var quet = callBigMetaData.map((item) => {
        return item.BigMetaData;
      });
      var result = [];
      function analyzeVolume(currentVolume, historicalVolume) {
        if (historicalVolume === 0) {
          return "Invalid historical volume data";
        }

        let volumeRatio;
        if (
          !isNaN(currentVolume) &&
          !isNaN(historicalVolume) &&
          historicalVolume !== 0
        ) {
          volumeRatio = currentVolume / historicalVolume;
        } else {
          volumeRatio = null;
        }
        if (volumeRatio === null) {
          return "Invalid volume ratio data";
        } else if (volumeRatio >= 0.1) {
          return "Pump pump pump 🔥 🔥 🔥";
        } else if (volumeRatio >= 0.001 && volumeRatio < 0.1) {
          return "Invest a moderate amount 🔥 🔥";
        } else if (volumeRatio < 0.001 && volumeRatio > 0.0003) {
          return "Invest small amounts 🔥";
        } else {
          return "Weak volume should not be held ⚠️ ";
        }
      }

      var currentVolumes = donecall;
      var historicalVolumes = [];
      for (let i = 0; i < quet.length; i++) {
        for (let j = 0; j < quet[i].length; j++) {
          historicalVolumes.push(quet[i][j].total_volume);
        }
      }

      for (let i = 0; i < doneCall.length; i++) {
        let currentVolume = doneCall[i].total_volume;
        let analysis = analyzeVolume(currentVolume, historicalVolumes[i]);
        result.push({ db: doneCall[i], tinhieu: analysis });
      }

      analyzeVolume(donecall, historicalVolumes);

      res.status(200).json({
        topPump: result,
        call: true,
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
      console.log(err);
      return res.send("404 Not Found");
    }
  }
  async getOff(req, res, next) {
    const check = req.user;
    const checkRole = check.Role.NameRole;
    const admin = checkRole === "Admin";
    const manager = checkRole === "Manager";
    res.render("trendingOff", {
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
  }
  handleWebSocket(ws) {
    const wss = new WebSocket.Server({ port: 3000 });
    ws.on("message", async (message) => {
      const api =
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
      try {
        const response = await axios.get(api);
        const doneCall = response.data.map((item) => ({
          id: item.id,
          symbol: item.symbol,
          name: item.name,
          image: item.image,
          current_price: item.current_price,
          market_cap_rank: item.market_cap_rank,
          total_volume: item.total_volume,
          last_updated: item.last_updated,
          high_24h: item.high_24h,
          low_24h: item.low_24h,
        }));
        ws.send(JSON.stringify(doneCall));
      } catch (err) {
        console.log(err);
        ws.send("Error fetching data");
      }
    });
  }
}

module.exports = new BotTrendingController();
