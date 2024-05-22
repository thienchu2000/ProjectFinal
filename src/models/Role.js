const mongoose = require("mongoose");

const Role = new mongoose.Schema({
  NameRole: String,
});

module.exports = mongoose.model("Role", Role);
