const mongoose = require("mongoose");

const Payments = new mongoose.Schema(
  {
    User: { type: mongoose.Schema.ObjectId, ref: "Users" },
    Bot: { type: mongoose.Schema.ObjectId, ref: "Bots" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payments", Payments);
