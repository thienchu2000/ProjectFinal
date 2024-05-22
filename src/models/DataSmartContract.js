const mongoose = require("mongoose");

const DataSmartContract = new mongoose.Schema(
  {
    SmartContract: String,
    Bot: { type: mongoose.Schema.ObjectId, ref: "Bots" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DataSmartContract", DataSmartContract);
