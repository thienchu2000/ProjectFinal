const mongoose = require("mongoose");

const NewsCrypto = new mongoose.Schema(
  {
    NameNew: String,
    Description: String,
    Image: String,
    Status: String,
    Status: {
      type: String,
      default: "Pending",
    },
    User: { type: mongoose.Schema.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NewsCrypto", NewsCrypto);
