const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const Role = require("../models/Roles");
const { Web3 } = require("web3");
const httpProvider = new Web3.providers.HttpProvider(process.env.infura);
const web3 = new Web3(httpProvider);
const testhttpProvider = new Web3.providers.HttpProvider(
  process.env.infuraTest
);
const testweb3 = new Web3(testhttpProvider);
const axios = require("axios");
const EventEmitter = require("eventemitter3");
var EE = new EventEmitter(),
  context = { foo: "bar" };
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
const nodemailer = require("nodemailer");
const datacoin = require("../utils/datacoin");
const coverData = require("../utils/coverData");
const Order = require("../models/Orders");
const Staking = require("../models/staking");
const processRequest = require("../utils/connect");
const laikep = require("../utils/stak");
const ABITOKEN = require("../contracts/MiChuETH.json");
const UserStaking = require("../models/UsersStaking");

class HomeController {
  async index(req, res, next) {
    try {
      const io = res.io;
      const info = res.locals;
      var role = await Role.findOne({ _id: info.Role });
      const chainId = 1;
      const gas = await axios.get(
        `https://gas.api.infura.io/v3/${process.env.INFURA_API_KEY}/networks/${chainId}/suggestedGasFees`
      );
      const getGas = gas.data;
      const limit = Math.round(getGas.estimatedBaseFee);
      datacoin(io);
      const percent = (await Staking.find({})).map((item) => item.percent);
      const query = await UserStaking.find({});
      const currentDate = new Date();
      const newdateTime = currentDate.getTime();
      const check = query
        .filter((item) => {
          const daysElapsed =
            (newdateTime - item.createdAt.getTime()) / (3600 * 1000 * 24);
          return daysElapsed >= item.day && item.txHash === undefined;
        })
        .map((item) => {
          return item;
        });
      const privateKeyOwner = process.env.privateKeyhex.trim();
      const contractAddress = "0xF00aa648C743a0dfF310c62EaCe3dF9757A14Ef8";
      const ownerAddress = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
      const gasPrice = await testweb3.eth.getGasPrice();
      const updatedGasPriceHex = testweb3.utils.toHex(parseInt(gasPrice) + 1);

      const gasLimitHex = "0x493e0";
      const contract = new testweb3.eth.Contract(ABITOKEN.abi, contractAddress);
      const accounts =
        testweb3.eth.accounts.privateKeyToAccount(privateKeyOwner);

      if (!testweb3.eth.accounts.wallet[ownerAddress]) {
        testweb3.eth.accounts.wallet.add(accounts);
      }
      if (check) {
        for (let i = 0; i < check.length; i++) {
          var lai = laikep(check[i].price, percent, check[i].day);
          const txDataTransfer = {
            from: ownerAddress,
            to: contractAddress,
            data: contract.methods
              .transfer(
                check[i].addressUser,
                web3.utils.toWei(String(lai), "ether")
              )
              .encodeABI(),
            value: "0x0",
            gas: gasLimitHex,
            gasPrice: updatedGasPriceHex,
          };
          const signedTxTransfer = await testweb3.eth.accounts.signTransaction(
            txDataTransfer,
            privateKeyOwner
          );
          console.log(typeof signedTxTransfer.transactionHash);
          UserStaking.findOneAndUpdate(
            { _id: check[i]._id },
            { txHash: signedTxTransfer.transactionHash }
          ).then((result) => console.log(result));
          const receiptTransfer = await testweb3.eth.sendSignedTransaction(
            signedTxTransfer.rawTransaction
          );
          console.log(check[i]._id);
        }
      }

      if (!role) {
        res.render("home");
      }
      if (role.NameRole === "Admin") {
        res.render("home", {
          admin: true,
          User: true,
          limit: limit,
          getGas: getGas,
          info: info,
          percent: percent,
          Name: info.UserName,
          Image: info.Image,
          Back: "/assets/Logo.png",
          // back: "https://haycafe.vn/wp-content/uploads/2022/05/Background-xam-den.jpg",
        });
      }
      if (role.NameRole === "Manager") {
        res.render("home", {
          manager: true,
          User: true,
          info: info,
          limit: limit,
          percent: percent,
          getGas: getGas,
          Name: info.UserName,
          Image: info.Image,
          Back: "/assets/Logo.png",
          // back: "https://haycafe.vn/wp-content/uploads/2022/05/Background-xam-den.jpg",
        });
      }
      if (role.NameRole === "User") {
        res.render("home", {
          User: true,
          info: info,
          limit: limit,
          percent: percent,
          getGas: getGas,
          Name: info.UserName,
          Image: info.Image,
        });
      }
    } catch (err) {
      console.error(err);
      return res.send(err);
    }
  }
  async logout(req, res, next) {
    res.clearCookie("access_token");
    const io = res.io;
    const chainId = 1;
    const gas = await axios.get(
      `https://gas.api.infura.io/v3/${process.env.INFURA_API_KEY}/networks/${chainId}/suggestedGasFees`
    );
    const getGas = gas.data;
    const limit = Math.round(getGas.estimatedBaseFee);
    datacoin(io);
    return res.render("home", {
      // back: "https://haycafe.vn/wp-content/uploads/2022/05/Background-xam-den.jpg",
      limit: limit,
      getGas: getGas,
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
          Wish you have fun using the service
        </h3>`,
      };
      await transport.sendMail(mailOptions);
      res.status(200).redirect("/");
    } catch (Err) {
      console.log(Err);
      return res.send("Err");
    }
  }
  async login(req, res, next) {
    const io = res.io;
    const { Email, PassWord } = req.body;

    var admin;
    var manager;
    try {
      if (!PassWord || !Email) {
        return res.status(400).send("Please enter correct information");
      }
      const check = await Users.findOne({ Email }).populate("Role");
      const checkRole = check.Role.NameRole;
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
      const percent = (await Staking.find({})).map((item) => item.percent);
      const chainId = 1;
      const gas = await axios.get(
        `https://gas.api.infura.io/v3/${process.env.INFURA_API_KEY}/networks/${chainId}/suggestedGasFees`
      );
      const getGas = gas.data;
      const limit = Math.round(getGas.estimatedBaseFee);
      if (!check) {
        return res.status(400).send("Account does not exist");
      }
      datacoin(io);
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
          limit: limit,
          percent: percent,
          getGas: getGas,
          manager: manager,
          admin: admin,
          Back: "/assets/Logo.png",
          // back: "https://haycafe.vn/wp-content/uploads/2022/05/Background-xam-den.jpg",
        });
      });
    } catch (Error) {
      console.log(Error);
      return res.send("Error");
    }
  }
  async getAbout(req, res, next) {
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
      res.render("about", {});
    }
    if (user) {
      res.render("about", {
        User: true,
        Name: user.UserName,
        Image: user.Image,
        manager: manager,
        admin: admin,
      });
    }
  }
  async findUser(req, res, next) {
    try {
      const check = req.user;
      const checkRole = check.Role.NameRole;
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
      const data = await Users.findOne({ _id: check._id });

      res.render("information", {
        data: data,
        User: true,
        manager: manager,
        admin: admin,
        Name: check.UserName,
        Image: check.Image,
      });
    } catch (err) {
      return res.send("err");
    }
  }
  async change(req, res, next) {
    const check = req.user;
    const checkRole = check.Role.NameRole;
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
    const data = await Users.findOne({ _id: check._id });
    res.render("updateuser", {
      data: data,
      User: true,
      manager: manager,
      admin: admin,
      Name: check.UserName,
      Image: check.Image,
    });
  }
  changeUser(req, res, next) {
    const {
      UserName,
      LastName,
      FirstName,
      Phone,
      Address,
      Birthday,
      Country,
      City,
    } = req.body;
    const check = req.user;
    var info = {};
    if (UserName) {
      info.UserName = UserName;
    }
    if (LastName) {
      info.LastName = LastName;
    }
    if (FirstName) {
      info.FirstName = FirstName;
    }
    if (Phone) {
      info.Phone = Phone;
    }
    if (Address) {
      info.Address = Address;
    }
    if (Country) {
      info.Country = Country;
    }
    if (Birthday) {
      info.Birthday = Birthday;
    }
    if (City) {
      info.City = City;
    }
    Users.findOneAndUpdate({ _id: check._id }, info)
      .then(() => {
        res.status(200).redirect("/change");
      })
      .catch((err) => {
        return res.status(404).send(err);
      });
  }
  async changeImg(req, res, next) {
    const check = req.user;
    const Image = req.file.filename;
    Users.findOneAndUpdate({ _id: check._id }, { Image: Image })
      .then(() => {
        res.status(200).redirect("/change");
      })
      .catch((err) => {
        return res.status(404).send(err);
      });
  }
  async order(req, res, next) {
    try {
      const check = req.user;
      const checkRole = check.Role.NameRole;
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

      const c = await Order.find({ User: check._id })
        .populate("Bot")
        .populate("Nft");
      const stakingg = await UserStaking.find({
        user: check._id,
      });
      const percent = (await Staking.find({})).map((item) => item.percent);

      var staking = [];
      for (let i = 0; i < stakingg.length; i++) {
        staking.push({
          lai: laikep(stakingg[i].price, percent, stakingg[i].day),
          data: stakingg[i],
        });
      }
      res.render("userOrder", {
        Cr: c,
        User: true,
        staking: staking,
        manager: manager,
        admin: admin,
        Name: check.UserName,
        Image: check.Image,
      });
    } catch (err) {
      return res.send(err);
    }
  }
  async staking(req, res, next) {
    const { addressUser, price, txhash, day } = req.body;
    const Id = req.user;
    console.log(req.body);

    try {
      var check = await processRequest(txhash);
      if (check.status === 1n) {
        const userStaking = new UserStaking({
          user: Id._id,
          price: price,
          addressUser: addressUser,
          day: day,
        });
        userStaking.save();
      }
      res.status(200).json({ message: "Success" });
    } catch (err) {
      return res.send(err);
    }
  }
}

module.exports = new HomeController();
