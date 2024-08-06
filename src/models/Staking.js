const mongoose = require("mongoose");

const Staking = new mongoose.Schema(
  {
    percent: String,
    users: { type: mongoose.Schema.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staking", Staking);
