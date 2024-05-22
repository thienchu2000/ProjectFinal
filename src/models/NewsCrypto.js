const mongoose = require("mongoose");

const NewsCrypto = new mongoose.Schema(
  {
    NameNew: String,
    Description: String,
    Image: String,
    User: { type: mongoose.Schema.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NewsCrypto", NewsCrypto);
