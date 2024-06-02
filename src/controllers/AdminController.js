const Users = require("../models/Users");
const Roles = require("../models/Roles");
const coverData = require("../utils/coverData");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const NewsCrypto = require("../models/NewsCrypto");
const axios = require("axios");

class AdminController {
  async index(req, res, next) {
    try {
      const check = req.user;
      const data = await Users.find({}).populate("Role");
      const Role = await Roles.find({});
      res.render("admin/dashboard", {
        data: data,
        Role: Role,
        User: true,
        admin: true,
        Name: check.UserName,
        _id: check._id,
        Image: check.Image,
      });
    } catch (err) {
      console.log(err);
      return res.send("error");
    }
  }
  update(req, res, next) {
    const id = req.params.id;
    const { Role } = req.body;
    var obj = {};
    if (Role) {
      obj.Role = Role;
    }
    Users.findOneAndUpdate({ _id: id }, obj)
      .then(() => {
        res.status(200).send("Done");
      })
      .catch((err) => {
        console.error(err);
        return res.status(404).send("Error");
      });
  }
  delete(req, res, next) {
    console.log("davao");
    var id = req.params.id;
    Users.deleteOne({ _id: id })
      .then(() => {
        res.status(200).send("Success");
      })
      .catch((err) => res.status(500).send("Error"));
  }
  async createUser(req, res, next) {
    try {
      const check = req.user;
      res.render("admin/createUser", {
        User: true,
        Name: check.UserName,
        _id: check._id,
        admin: true,
        Image: check.Image,
        Role: check.Role,
      });
    } catch (err) {
      console.log(err);
      return res.send("error");
    }
  }
  async rigisterUser(req, res, next) {
    const { UserName, Email, Phone, PassWord, Role } = req.body;

    try {
      if (!UserName || !Email || !Phone || !PassWord || !Role) {
        return res.send("Please enter correct information");
      }
      const checkEmail = await Users.findOne({ Email });
      if (checkEmail) {
        return res.status(400).send("Email already exists");
      }
      if (PassWord.length < 6) {
        return res.status(400).send("Password must be more than 6 characters");
      }
      if (!/[A-Z]/.test(PassWord)) {
        return res.status(400).send("must have capital letters");
      }
      const hashPassword = await bcrypt.hashSync(PassWord, 10);
      const user = new Users({
        UserName,
        Email,
        Phone,
        Role,
        PassWord: hashPassword,
      });
      user.save();
      const OAuth2Client = google.auth.OAuth2;
      const myOAuth2Client = new OAuth2Client(
        process.env.GOOGLE_MAILER_CLIENT_ID,
        process.env.GOOGLE_MAILER_CLIENT_SECRET
      );
      myOAuth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
      });
      const myAccessTokenObject = await myOAuth2Client.getAccessToken();
      const myAccessToken = myAccessTokenObject.token;
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.ADMIN_EMAIL_ADDRESS,
          clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
          clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
          refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
          accessToken: myAccessToken,
        },
      });
      const mailOptions = {
        to: Email,
        subject: `Welcome to Bots`,
        html: `<h3>  welcome ${UserName} from Bots : 
            We give you acoust from you:
            password: ${PassWord}
          </h3>`,
      };
      await transport.sendMail(mailOptions);
      res.status(200).redirect("/admin");
    } catch (Err) {
      console.log(Err);
      return res.send("Err");
    }
  }
  async findNews(req, res, next) {
    try {
      const data = await NewsCrypto.find({});
      const check = req.user;
      res.render("admin/findNew", {
        data: data,
        User: true,
        Name: check.UserName,
        _id: check._id,
        admin: true,
        Image: check.Image,
        Role: check.Role,
      });
    } catch (err) {
      console.log(err);
      return res.send("error");
    }
  }
  updateNews(req, res, next) {
    const id = req.params.id;
    const Status = req.body.Status;

    NewsCrypto.findOneAndUpdate({ _id: id }, { Status: Status })
      .then(() => {
        res.status(200).send("Done");
      })
      .catch((err) => {
        console.error(err);
        return res.status(404).send("Error");
      });
  }
  deleteNew(req, res, next) {
    var id = req.params.id;
    NewsCrypto.deleteOne({ _id: id })
      .then(() => {
        res.status(200).send("Success");
      })
      .catch((err) => res.status(500).send("Error"));
  }
}

module.exports = new AdminController();
