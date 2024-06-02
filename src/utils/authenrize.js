const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Role = require("../models/Roles");

function isUser(req, res, next) {
  var roleId = req.user.Role;
  Role.findOne({ _id: roleId })
    .then((data) => {
      if (data.NameRole === "User") {
        next();
      } else {
        return res.render("error");
      }
    })
    .catch((err) => {
      return res.send(err);
    });
}

function isAdmin(req, res, next) {
  var roleId = req.user.Role;
  Role.findOne({ _id: roleId })
    .then((data) => {
      if (data.NameRole === "Admin") {
        next();
      } else {
        return res.render("error");
      }
    })
    .catch((err) => {
      return res.send(err);
    });
}

function isManager(req, res, next) {
  var roleId = req.user.Role;
  Role.findOne({ _id: roleId })
    .then((data) => {
      console.log(data);
      if (data.NameRole === "Manager") {
        next();
      } else {
        return res.render("error");
      }
    })
    .catch((err) => {
      return res.send(err);
    });
}

module.exports = { isAdmin, isUser, isManager };
