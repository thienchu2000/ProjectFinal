const mongoose = require("mongoose");

const Roles = new mongoose.Schema({
  NameRole: String,
});
module.exports = mongoose.model("Roles", Roles);
