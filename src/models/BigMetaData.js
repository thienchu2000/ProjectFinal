const mongoose = require("mongoose");

const tokenInfo = new mongoose.Schema({
  id: String,
  name: String,
  symbol: String,
  image: String,
  current_price: Number,
  market_cap_rank: Number,
  total_volume: Number,
  last_updated: Date,
  high_24h: Number,
  low_24h: Number,
});
const BigMetaData = new mongoose.Schema(
  {
    Bot: { type: mongoose.Schema.ObjectId, ref: "Bots" },
    BigMetaData: [tokenInfo],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BigMetaData", BigMetaData);
