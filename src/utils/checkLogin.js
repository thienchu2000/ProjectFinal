const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

function checkLogin(req, res, next) {
  const cookies = req.cookies["access_token"];
  if (!cookies) {
    return res.redirect("/home");
  }
  const decoded = jwt.verify(cookies, process.env.jwt);
  req.user = decoded;
  next();
}

module.exports = checkLogin;
