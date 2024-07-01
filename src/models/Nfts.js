const mongoose = require("mongoose");

const Nfts = new mongoose.Schema(
  {
    User: { type: mongoose.Schema.ObjectId, ref: "Users" },
    NameProduct: String,
    Image: String,
    Description: String,
    Comment: String,
    Price: Number,
    SmartContact: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nfts", Nfts);
