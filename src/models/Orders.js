const mongoose = require("mongoose");

const Orders = new mongoose.Schema(
  {
    User: { type: mongoose.Schema.ObjectId, ref: "Users" },
    Bot: { type: mongoose.Schema.ObjectId, ref: "Bots" },
    Payment: { type: mongoose.Schema.ObjectId, ref: "Payment" },
    Nft: { type: mongoose.Schema.ObjectId, ref: "Nfts" },
    TokenId: String,
    SmartContract: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", Orders);
