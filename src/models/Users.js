const mongoose = require("mongoose");
const Users = new mongoose.Schema(
  {
    Role: {
      type: mongoose.Schema.ObjectId,
      ref: "Roles",
      default: "6656e3036f48cf6caf27e5b8",
    },
    UserName: String,
    LastName: String,
    FirstName: String,
    Email: String,
    PassWord: String,
    Phone: String,
    Image: {
      type: String,
      default: "crawl-20230923145808568-20230923145808576.png",
    },
    Address: String,
    Birthday: String,
    City: String,
    Country: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", Users);
