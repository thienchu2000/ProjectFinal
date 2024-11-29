const NewsCrypto = require("../models/NewsCrypto");
const coverData = require("../utils/coverData");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const Users = require("../models/Users");

class ManagerController {
  index(req, res, next) {
    const check = req.user;
    res.render("manager", {
      User: true,
      Name: check.UserName,
      _id: check._id,
      manager: true,
      Image: check.Image,
      Role: check.Role,
      Back: "/assets/Logo.png",
      back: "https://haycafe.vn/wp-content/uploads/2022/05/Background-xam-den.jpg",
    });
  }
  CreateNews(req, res, next) {
    const idUser = req.user;
    const image = req.file.filename;
    const { NameNew, Description } = req.body;
    const newscrypto = new NewsCrypto({
      NameNew: NameNew,
      Description: Description,
      Image: image,
      User: idUser,
    });

    newscrypto.save();
    res.redirect("/manager");
  }
  async FindData(req, res, next) {
    try {
      const data = await NewsCrypto.find({});
      const check = req.user;
      res.render("managerData", {
        data: data,
        User: true,
        Name: check.UserName,
        _id: check._id,
        manager: true,
        Image: check.Image,
        Role: check.Role,
      });
    } catch (err) {
      console.log(err);
      return res.send("error");
    }
  }
  updateNew(req, res, next) {
    const id = req.params.id;
    const { NameNew, Description } = req.body;
    var Image = req.file.filename;
    NewsCrypto.findByIdAndUpdate(
      { _id: id },
      { NameNew: NameNew, Description: Description, Image: Image }
    )
      .then((done) => {
        res.redirect("/manager/managerData");
      })
      .catch((err) => {
        return res.send("err");
      });
  }
  sendEmail(req, res, next) {
    const check = req.user;
    res.render("managerSendEmail", {
      User: true,
      Name: check.UserName,
      _id: check._id,
      manager: true,
      Image: check.Image,
      Role: check.Role,
    });
  }
  async createEmail(req, res, next) {
    const { title, content } = req.body;
    try {
      const findEmail = await Users.find({});
      const email = findEmail.map((item) => item.Email);
      const OAuth2Client = google.auth.OAuth2;
      const myOAuth2Client = new OAuth2Client(
        process.env.GOOGLE_MAILER_CLIENT_ID1,
        process.env.GOOGLE_MAILER_CLIENT_SECRET1
      );
      myOAuth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN1,
      });
      const myAccessTokenObject = await myOAuth2Client.getAccessToken();
      const myAccessToken = myAccessTokenObject.token;
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.ADMIN_EMAIL_ADDRESS1,
          clientId: process.env.GOOGLE_MAILER_CLIENT_ID1,
          clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET1,
          refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN1,
          accessToken: myAccessToken,
        },
      });
      const mailOptions = {
        to: email.splice(","),
        subject: `${title}`,
        html: `<h3>  ${content}
      </h3>`,
      };
      await transport.sendMail(mailOptions);
      res.status(200).redirect("/manager/sendEmail");
    } catch (err) {
      console.error(err);
      return res.send("err");
    }
  }
}

module.exports = new ManagerController();
