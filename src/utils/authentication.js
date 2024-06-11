const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");
const datacoin = require("../utils/datacoin");
async function authentication(req, res, next) {
  var cookies = req.cookies["access_token"];

  if (!cookies) {
    const chainId = 1;
    const io = res.io;
    const gas = await axios.get(
      `https://gas.api.infura.io/v3/${process.env.INFURA_API_KEY}/networks/${chainId}/suggestedGasFees`
    );
    const getGas = gas.data;
    const limit = Math.round(getGas.estimatedBaseFee);
    datacoin(io);
    return res.render("home", {
      limit: limit,
      getGas: getGas,
    });
  }
  var decoded = jwt.verify(cookies, process.env.jwt);
  res.locals = decoded;
  next();
}

module.exports = authentication;
