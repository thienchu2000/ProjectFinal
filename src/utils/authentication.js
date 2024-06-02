const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");

async function authentication(req, res, next) {
  var cookies = req.cookies["access_token"];
  if (!cookies) {
    const chainId = 1;
    const gas = await axios.get(
      `https://gas.api.infura.io/v3/${process.env.INFURA_API_KEY}/networks/${chainId}/suggestedGasFees`
    );
    const getGas = gas.data;
    const limit = Math.round(getGas.estimatedBaseFee);
    return res.render("home", {
      back: "https://haycafe.vn/wp-content/uploads/2022/05/Background-xam-den.jpg",
      limit: limit,
      getGas: getGas,
    });
  }
  var decoded = jwt.verify(cookies, process.env.jwt);
  res.locals = decoded;
  next();
}

module.exports = authentication;
