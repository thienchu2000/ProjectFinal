const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

class HomeController {
  index(req, res, next) {
    const info = res.locals;
    if (info) {
      res.render("home", {
        User: true,
        info: info,
        Name: info.UserName,
        back: "https://haycafe.vn/wp-content/uploads/2022/05/Background-xam-den.jpg",
      });
    }
  }
  logout(req, res, next) {
    res.clearCookie("access_token");
    return res.render("home", {
      back: "https://haycafe.vn/wp-content/uploads/2022/05/Background-xam-den.jpg",
    });
  }
  rg(req, res, next) {
    res.render("register", {
      back: "https://static.vecteezy.com/system/resources/previews/023/995/943/large_2x/ethereum-coin-symbol-with-blue-light-background-network-connection-by-generative-ai-free-photo.jpg",
    });
  }
  async register(req, res, next) {
    const { UserName, Email, Phone, PassWord } = req.body;
    try {
      if (!UserName || !Email || !Phone || !PassWord) {
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
        PassWord: hashPassword,
      });
      user.save();
      res.status(200).redirect("/");
    } catch (Err) {
      console.log(Err);
      return res.send("Err");
    }
  }
  async login(req, res, next) {
    const { Email, PassWord } = req.body;
    try {
      if (!PassWord || !Email) {
        return res.status(400).send("Please enter correct information");
      }
      const check = await Users.findOne({ Email });
      if (!check) {
        return res.status(400).send("Account does not exist");
      }

      await bcrypt.compare(PassWord, check.PassWord, function (Error, Result) {
        if (!Result) {
          return res.status(400).send("Incorrect password");
        }
        var token = jwt.sign(
          {
            _id: check._id,
            UserName: check.UserName,
            Email: check.Email,
            Role: check.Role,
            Image: check.Image,
          },
          process.env.jwt
        );
        res.cookie("access_token", token);
        res.render("home", {
          User: true,
          Name: check.UserName,
          _id: check._id,
          Image: check.Image,
          Role: check.Role,
          Back: "/assets/Logo.png",
          back: "https://haycafe.vn/wp-content/uploads/2022/05/Background-xam-den.jpg",
        });
      });
    } catch (Error) {
      return res.send("Error");
    }
  }
  getAbout(req, res, next) {
    const user = req.user;
    if (!user) {
      res.render("about", {
        back: "https://static.vecteezy.com/system/resources/previews/023/995/943/large_2x/ethereum-coin-symbol-with-blue-light-background-network-connection-by-generative-ai-free-photo.jpg",
      });
    } else {
      res.render("about", {
        User: true,
        Name: user.UserName,
        back: "https://static.vecteezy.com/system/resources/previews/023/995/943/large_2x/ethereum-coin-symbol-with-blue-light-background-network-connection-by-generative-ai-free-photo.jpg",
      });
    }
  }
}

module.exports = new HomeController();
