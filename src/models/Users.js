const mongoose = require("mongoose");

const Users = new mongoose.Schema(
  {
    Role: {
      type: mongoose.Schema.ObjectId,
      ref: "Role",
      default: "6623f513e6e58fdc6d35a892",
    },
    UserName: String,
    LastName: String,
    FirtName: String,
    Email: String,
    PassWord: String,
    Phone: String,
    Image: String,
    Address: String,
    BirthDay: String,
    City: String,
    CounTry: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", Users);
