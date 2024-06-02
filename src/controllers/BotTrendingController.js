const Crawler = require("crawler");
const cheerio = require("cheerio");
const axios = require("axios");
const Bots = require("../models/Bots");
const BigMetaData = require("../models/BigMetaData");
const coverData = require("../utils/coverData");
const dotenv = require("dotenv");
dotenv.config();
class BotTrendingController {
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
    try {
      const c = new Crawler({
        maxConnections: 10,
        callback: (error, resCrawler, done) => {
          if (error) {
            return res.send(error);
          } else {
            const html = resCrawler.body;
            const $ = cheerio.load(html);
            var data = $(
              ".tgme_widget_message_wrap.js-widget_message_wrap"
            ).text();
            var Arr = data.split(/[,\s]+/);
            let tokenInfo = [];
            let tempCA = "";
            for (let i = 0; i < Arr.length; i++) {
              if (Arr[i].startsWith("0x")) {
                tempCA = Arr[i];
                if (tempCA) {
                  tokenInfo.push({ CA: tempCA });
                }
              }
            }
            var clearToken = tokenInfo.map((item) => {
              return {
                CA: item.CA.split("Supply:")[0].split("This")[0].split("🔗")[0],
              };
            });
            res.render("botTrending", {
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
          }
          done();
        },
      });
      c.queue("https://t.me/s/iTokenEthereum");
    } catch (err) {
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

      for (let i = 0; i < quet.length; i++) {
        for (let j = 0; j < quet[i].length; j++) {
          let currentVolume = quet[i][j].total_volume;
          let analysis = analyzeVolume(currentVolume, historicalVolumes[i]);
          result.push({ db: quet[i][j], tinhieu: analysis });
        }
      }

      analyzeVolume(donecall, historicalVolumes);

      res.render("botTrending", {
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
}

module.exports = new BotTrendingController();
