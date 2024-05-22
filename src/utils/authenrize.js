// const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
// const Users = require("../models/Users");

// async function isUser(req, res, next) {
//   var cookies = req.cookies["access_token"];
//   var decoded = jwt.verify(cookies, process.env.jwt);
//   if (cookies) {
//     var user = await Users.findOne({ Role: decoded.Role }).equals({
//       _id: "6623f513e6e58fdc6d35a892",
//     });
//     next();
//   } else {
//     return res.status(401).send("You do not have permission to log in here");
//   }
// }

// async function isAdmin(req, res, next) {
//   var cookies = req.cookies["access_token"];
//   var decoded = jwt.verify(cookies, process.env.jwt);
//   if (cookies) {
//     var user = await Users.findOne({ Role: decoded.Role }).equals({
//       _id: "6623f48de6e58fdc6d35a891",
//     });
//     next();
//   } else {
//     return res.status(401).send("You do not have permission to log in here");
//   }
// }
