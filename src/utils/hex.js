const crypto = require("crypto");

function stringToHex(input) {
  return Buffer.from(input, "utf8").toString("hex");
}

module.exports = stringToHex;
