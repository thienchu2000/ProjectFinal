const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

function authentication(req, res, next) {
  var cookies = req.cookies["access_token"];
  if (!cookies) {
    return res.render("home", {
      back: "https://haycafe.vn/wp-content/uploads/2022/05/Background-xam-den.jpg",
    });
  }
  var decoded = jwt.verify(cookies, process.env.jwt);
  res.locals = decoded;
  next();
}

module.exports = authentication;
