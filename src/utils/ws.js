const axios = require("axios");
const BigMetaData = require("../models/BigMetaData");

async function setResult(io) {
  const api = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
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
      price_change_24h: item.price_change_24h,
      price_change_percentage_24h: item.price_change_percentage_24h,
      market_cap_change_24h: item.market_cap_change_24h,
      market_cap_change_percentage_24h: item.market_cap_change_percentage_24h,
      circulating_supply: item.circulating_supply,
      total_supply: item.total_supply,
      max_supply: item.max_supply,
      ath: item.ath,
      ath_change_percentage: item.ath_change_percentage,
      ath_date: item.ath_date,
      atl: item.atl,
      atl_change_percentage: item.atl_change_percentage,
      atl_date: item.atl_date,
      roi: item.roi,
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
  const result = [];
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
  var time = new Date();
  console.log(time);
  analyzeVolume(donecall, historicalVolumes);

  io.on("connect", () => {
    io.emit("callback", result);
  });
  io.emit("callback", result);
  io.on("disconnect", () => {
    console.log("user disconnected");
  });
  io.on("error", (error) => {
    console.error("Socket.IO error:", error);
  });
}

module.exports = setResult;
