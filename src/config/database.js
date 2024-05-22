const mongoose = require("mongoose");
const dotenv = require("dotenv");

async function connect(mongodb) {
  mongoose.connect(process.env.mongodb, {});
  mongoose.connection
    .once("open", () => {
      console.log("Mongodb connected");
    })
    .on("error", () => {
      console.log("Mongodb connected Error !!!");
    });
}

module.exports = { connect };
