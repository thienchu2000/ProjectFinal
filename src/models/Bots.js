const mongoose = require("mongoose");

const Bots = new mongoose.Schema(
  {
    User: { type: mongoose.Schema.ObjectId, ref: "Users" },
    NameProduct: String,
    Image: String,
    Description: String,
    Comment: String,
    Price: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bots", Bots);
