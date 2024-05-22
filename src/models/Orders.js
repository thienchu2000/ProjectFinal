const mongoose = require("mongoose");

const Orders = new mongoose.Schema(
  {
    User: { type: mongoose.Schema.ObjectId, ref: "Users" },
    Bot: { type: mongoose.Schema.ObjectId, ref: "Bot" },
    Payment: { type: mongoose.Schema.ObjectId, ref: "Payment" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", Orders);
