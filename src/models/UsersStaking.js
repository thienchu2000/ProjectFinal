const mongoose = require("mongoose");
const UserStaking = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    price: Number,
    addressUser: String,
    day: Number,
    txHash: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserStaking", UserStaking);
