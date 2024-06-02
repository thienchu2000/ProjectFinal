const NewsCrypto = require("../models/NewsCrypto");
const Role = require("../models/Roles");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const Users = require("../models/Users");

class NewsController {
  async index(req, res, next) {
    try {
      var data = await NewsCrypto.find({});
      var approved = data
        .filter((item) => {
          return item.Status === "Approved";
        })
        .map((item) => {
          return item;
        });
      const user = req.user;
      const checkRole = user.Role.NameRole;
      var admin;
      var manager;
      if (checkRole === "Admin") {
        admin = true;
      } else {
        admin = false;
      }
      if (checkRole === "Manager") {
        manager = true;
      } else {
        manager = false;
      }
      if (!user) {
        res.render("news", { data: data });
      } else {
        res.render("news", {
          User: true,
          Name: user.UserName,
          manager: manager,
          admin: admin,
          Image: user.Image,
          data: approved,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new NewsController();
