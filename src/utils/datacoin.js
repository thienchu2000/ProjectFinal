const axios = require("axios");

async function datacoin(io) {
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
  var time = new Date();
  console.log(time);
  io.on("connect", (socket) => {
    socket.emit("datacoin", doneCall);
  });
  io.on("disconnect", () => {
    console.log("user disconnected");
    clearInterval(itemh);
  });
  io.on("error", (error) => {
    console.error("Socket.IO error:", error);
  });
}

module.exports = datacoin;
