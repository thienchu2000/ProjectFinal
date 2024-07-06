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
const Bots = require("../models/Bots");
const Nfts = require("../models/Nfts");
const Order = require("../models/Orders");
const { Web3 } = require("web3");
const httpProvider = new Web3.providers.HttpProvider(process.env.infuraTest);
const web3 = new Web3(httpProvider);
const ABItoken = require("../contracts/MiChuTokenA.json");
const sleep = require("../utils/slepp");
const ABINFT = require("../contracts/WordLegendNFT_one1.json");
const ABITOKEN = require("../contracts/MiChuETH.json");

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
  async getBot(req, res, next) {
    try {
      const contractAddress = "0xF00aa648C743a0dfF310c62EaCe3dF9757A14Ef8";
      const contract = new web3.eth.Contract(ABITOKEN.abi, contractAddress);
      const name = await contract.methods.name().call();
      const symbol = await contract.methods.symbol().call();
      const buyTax = await contract.methods.buyTax().call();
      const sellTax = await contract.methods.sellTax().call();
      const sellLocked = await contract.methods._sellLocked().call();
      const owner = await contract.methods.owner().call();
      const totalSupply = await contract.methods.totalSupply().call();
      const formattedTotalSupply = web3.utils.fromWei(
        totalSupply.toString(),
        "ether"
      );
      var done;
      if (sellLocked === false) {
        done = "unlocked";
      } else {
        done = "locked";
      }
      const data = await Bots.find({});
      const qy = await Nfts.find({});

      const check = req.user;
      res.render("admin/createInforBot", {
        qy: qy,
        data: data,
        User: true,
        Name: check.UserName,
        _id: check._id,
        admin: true,
        Image: check.Image,
        Role: check.Role,
        buyTax,
        sellTax,
        sellLocked: done,
        owner,
        formattedTotalSupply,
        name,
        symbol,
      });
    } catch (err) {
      console.error("Error fetching bot information:", err);
      res.status(500).send("Error fetching bot information");
    }
  }

  createInforBot(req, res, next) {
    const id = req.params.id;
    const { Description, Price } = req.body;
    Bots.findOneAndUpdate({ _id: id }, { ...req.body })
      .then(() => {
        res.status(200).send("Done");
      })
      .catch((err) => {
        console.error(err);
        return res.status(404).send("Error");
      });
  }
  createNft(req, res, next) {
    console.log("davao");
    const id = req.params.id;
    const { Price } = req.body;
    console.log(Price, id);
    Nfts.findOneAndUpdate({ _id: id }, { ...req.body })
      .then(() => {
        res.status(200).send("Done");
      })
      .catch((err) => {
        console.error(err);
        return res.status(404).send("Error");
      });
  }
  async getOrder(req, res, next) {
    const check = req.user;
    try {
      const qy = await Order.find({})
        .populate("Bot")
        .populate("Nft")
        .populate("User");
      res.render("admin/order", {
        qy: qy,
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
  async volumFake(req, res, next) {
    const {
      transactions,
      transactionTime,
      wallet,
      unpause,
      pricemin,
      pricemax,
    } = req.body;
    console.log("unpause", typeof pricemax, typeof pricemin);

    var result = [];
    var wallets;
    const privateKeyOwner = process.env.privateKeyhex.trim();
    const contractAddress = "0xF00aa648C743a0dfF310c62EaCe3dF9757A14Ef8";
    const ownerAddress = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimitHex = "0x493e0";

    if (wallet === "1") {
      wallets = [
        {
          address: "0x0Eba7d628c6107D552c40D41A2857648021C5Dee",
          privateKey: process.env.pri1,
        },
      ];
    }
    if (wallet === "2") {
      wallets = [
        {
          address: "0x0Eba7d628c6107D552c40D41A2857648021C5Dee",
          privateKey: process.env.pri1,
        },
        {
          address: "0xd716140fd7C0259611760AD4a68191777C3317E5",
          privateKey: process.env.pri2,
        },
      ];
    }
    if (wallet === "3") {
      wallets = [
        {
          address: "0x0Eba7d628c6107D552c40D41A2857648021C5Dee",
          privateKey: process.env.pri1,
        },
        {
          address: "0xd716140fd7C0259611760AD4a68191777C3317E5",
          privateKey: process.env.pri2,
        },
        {
          address: "0x6A33F786215e02f82Dd08A149A593Bc4b984469B",
          privateKey: process.env.pri3,
        },
      ];
    }
    if (wallet === "4") {
      wallets = [
        {
          address: "0x0Eba7d628c6107D552c40D41A2857648021C5Dee",
          privateKey: process.env.pri1,
        },
        {
          address: "0xd716140fd7C0259611760AD4a68191777C3317E5",
          privateKey: process.env.pri2,
        },
        {
          address: "0x6A33F786215e02f82Dd08A149A593Bc4b984469B",
          privateKey: process.env.pri3,
        },
        {
          address: "0xa2eA667bF3DC84d72506C602f64B109Db52794e3",
          privateKey: process.env.pri4,
        },
      ];
    }
    if (wallet === "5") {
      wallets = [
        {
          address: "0x0Eba7d628c6107D552c40D41A2857648021C5Dee",
          privateKey: process.env.pri1,
        },
        {
          address: "0xd716140fd7C0259611760AD4a68191777C3317E5",
          privateKey: process.env.pri2,
        },
        {
          address: "0x6A33F786215e02f82Dd08A149A593Bc4b984469B",
          privateKey: process.env.pri3,
        },
        {
          address: "0xa2eA667bF3DC84d72506C602f64B109Db52794e3",
          privateKey: process.env.pri4,
        },
        {
          address: "0x932a228bfa771970689F73f58898549e7bbE7951",
          privateKey: process.env.pri5,
        },
      ];
    }
    if (wallet === "6") {
      wallets = [
        {
          address: "0x0Eba7d628c6107D552c40D41A2857648021C5Dee",
          privateKey: process.env.pri1,
        },
        {
          address: "0xd716140fd7C0259611760AD4a68191777C3317E5",
          privateKey: process.env.pri2,
        },
        {
          address: "0x6A33F786215e02f82Dd08A149A593Bc4b984469B",
          privateKey: process.env.pri3,
        },
        {
          address: "0xa2eA667bF3DC84d72506C602f64B109Db52794e3",
          privateKey: process.env.pri4,
        },
        {
          address: "0x932a228bfa771970689F73f58898549e7bbE7951",
          privateKey: process.env.pri5,
        },
        {
          address: "0xf5C1FFCc92918a6f7799Ea17D71682Ba381f2972",
          privateKey: process.env.pri6,
        },
      ];
    }
    if (wallet === "7") {
      wallets = [
        {
          address: "0x0Eba7d628c6107D552c40D41A2857648021C5Dee",
          privateKey: process.env.pri1,
        },
        {
          address: "0xd716140fd7C0259611760AD4a68191777C3317E5",
          privateKey: process.env.pri2,
        },
        {
          address: "0x6A33F786215e02f82Dd08A149A593Bc4b984469B",
          privateKey: process.env.pri3,
        },
        {
          address: "0xa2eA667bF3DC84d72506C602f64B109Db52794e3",
          privateKey: process.env.pri4,
        },
        {
          address: "0x932a228bfa771970689F73f58898549e7bbE7951",
          privateKey: process.env.pri5,
        },
        {
          address: "0xf5C1FFCc92918a6f7799Ea17D71682Ba381f2972",
          privateKey: process.env.pri6,
        },
        {
          address: "0x87b71A690c1C2079AB701953bf4829fAA0CDAf76",
          privateKey: process.env.pri7,
        },
      ];
    }
    if (wallet === "8") {
      wallets = [
        {
          address: "0x0Eba7d628c6107D552c40D41A2857648021C5Dee",
          privateKey: process.env.pri1,
        },
        {
          address: "0xd716140fd7C0259611760AD4a68191777C3317E5",
          privateKey: process.env.pri2,
        },
        {
          address: "0x6A33F786215e02f82Dd08A149A593Bc4b984469B",
          privateKey: process.env.pri3,
        },
        {
          address: "0xa2eA667bF3DC84d72506C602f64B109Db52794e3",
          privateKey: process.env.pri4,
        },
        {
          address: "0x932a228bfa771970689F73f58898549e7bbE7951",
          privateKey: process.env.pri5,
        },
        {
          address: "0xf5C1FFCc92918a6f7799Ea17D71682Ba381f2972",
          privateKey: process.env.pri6,
        },
        {
          address: "0x87b71A690c1C2079AB701953bf4829fAA0CDAf76",
          privateKey: process.env.pri7,
        },
        {
          address: "0xD4Aa1843914C2F7704f8DA8ac9b0AA47680834c3",
          privateKey: process.env.pri8,
        },
      ];
    }
    if (wallet === "9") {
      wallets = [
        {
          address: "0x0Eba7d628c6107D552c40D41A2857648021C5Dee",
          privateKey: process.env.pri1,
        },
        {
          address: "0xd716140fd7C0259611760AD4a68191777C3317E5",
          privateKey: process.env.pri2,
        },
        {
          address: "0x6A33F786215e02f82Dd08A149A593Bc4b984469B",
          privateKey: process.env.pri3,
        },
        {
          address: "0xa2eA667bF3DC84d72506C602f64B109Db52794e3",
          privateKey: process.env.pri4,
        },
        {
          address: "0x932a228bfa771970689F73f58898549e7bbE7951",
          privateKey: process.env.pri5,
        },
        {
          address: "0xf5C1FFCc92918a6f7799Ea17D71682Ba381f2972",
          privateKey: process.env.pri6,
        },
        {
          address: "0x87b71A690c1C2079AB701953bf4829fAA0CDAf76",
          privateKey: process.env.pri7,
        },
        {
          address: "0xD4Aa1843914C2F7704f8DA8ac9b0AA47680834c3",
          privateKey: process.env.pri8,
        },
        {
          address: "0x8088Ff6cf5502a10Bf908a4Db4b9C9d78210d42A",
          privateKey: process.env.pri9,
        },
      ];
    }
    if (wallet === "10") {
      wallets = [
        {
          address: "0x0Eba7d628c6107D552c40D41A2857648021C5Dee",
          privateKey: process.env.pri1,
        },
        {
          address: "0xd716140fd7C0259611760AD4a68191777C3317E5",
          privateKey: process.env.pri2,
        },
        {
          address: "0x6A33F786215e02f82Dd08A149A593Bc4b984469B",
          privateKey: process.env.pri3,
        },
        {
          address: "0xa2eA667bF3DC84d72506C602f64B109Db52794e3",
          privateKey: process.env.pri4,
        },
        {
          address: "0x932a228bfa771970689F73f58898549e7bbE7951",
          privateKey: process.env.pri5,
        },
        {
          address: "0xf5C1FFCc92918a6f7799Ea17D71682Ba381f2972",
          privateKey: process.env.pri6,
        },
        {
          address: "0x87b71A690c1C2079AB701953bf4829fAA0CDAf76",
          privateKey: process.env.pri7,
        },
        {
          address: "0xD4Aa1843914C2F7704f8DA8ac9b0AA47680834c3",
          privateKey: process.env.pri8,
        },
        {
          address: "0x8088Ff6cf5502a10Bf908a4Db4b9C9d78210d42A",
          privateKey: process.env.pri9,
        },
        {
          address: "0x95072f248BbE3fc5f2f690e620Fea6dfe7665a5D",
          privateKey: process.env.pri10,
        },
      ];
    }

    try {
      const accountOwner =
        web3.eth.accounts.privateKeyToAccount(privateKeyOwner);
      if (!web3.eth.accounts.wallet[ownerAddress]) {
        web3.eth.accounts.wallet.add(accountOwner);
      }

      for (let i = 0; i < transactions; i++) {
        if (unpause === true) {
          break;
        }
        for (let j = 0; j < wallets.length; j++) {
          if (unpause === true) {
            break;
          }
          const { address: accountAddress, privateKey } = wallets[j];
          if (!web3.eth.accounts.wallet[accountAddress]) {
            const account = web3.eth.accounts.privateKeyToAccount(privateKey);
            web3.eth.accounts.wallet.add(account);
          }
          const contract = new web3.eth.Contract(ABITOKEN.abi, contractAddress);
          const amount = (
            Math.random() * (pricemax - pricemin) +
            pricemin
          ).toFixed(0);
          console.log("Price", amount);
          const updatedGasPriceHex = web3.utils.toHex(parseInt(gasPrice) + i);
          const txDataSell = {
            from: accountAddress,
            to: contractAddress,
            value: "0x0",
            data: contract.methods
              .transfer(ownerAddress, web3.utils.toWei(String(amount), "ether"))
              .encodeABI(),
            gas: gasLimitHex,
            gasPrice: updatedGasPriceHex,
          };

          const signedTxSell = await web3.eth.accounts.signTransaction(
            txDataSell,
            privateKey
          );
          const receiptSell = await web3.eth.sendSignedTransaction(
            signedTxSell.rawTransaction
          );

          console.log(
            `Transaction ${i + 1} (Sell) from ${accountAddress} hash:`,
            receiptSell.transactionHash
          );

          const txDataTransfer = {
            from: ownerAddress,
            to: contractAddress,
            data: contract.methods
              .transfer(
                accountAddress,
                web3.utils.toWei(String(amount), "ether")
              )
              .encodeABI(),
            value: "0x0",
            gas: gasLimitHex,
            gasPrice: updatedGasPriceHex,
          };

          const signedTxTransfer = await web3.eth.accounts.signTransaction(
            txDataTransfer,
            privateKeyOwner
          );
          const receiptTransfer = await web3.eth.sendSignedTransaction(
            signedTxTransfer.rawTransaction
          );

          console.log(
            `Transaction ${i + 1} (Transfer back to ${accountAddress}) hash:`,
            receiptTransfer.transactionHash
          );

          result.push({
            Sell: receiptSell.transactionHash,
            TransferBack: receiptTransfer.transactionHash,
          });

          await sleep(transactionTime);
        }
      }
      console.log("volume completed.");
      return res.status(200).json({
        result: coverData(result),
      });
    } catch (error) {
      console.error("Error executing fake volume:", error);
      return res.status(500).send(error.message);
    }
  }
  async mintTk(req, res, next) {
    const { MintAmount, MintWallet } = req.body;
    const privateKeyOwner = process.env.privateKeyhex.trim();
    const ownerAddress = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
    const contractAddress = "0xF00aa648C743a0dfF310c62EaCe3dF9757A14Ef8";
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimitHex = "0x493e0";

    const accountOwner = web3.eth.accounts.privateKeyToAccount(privateKeyOwner);
    web3.eth.accounts.wallet.add(accountOwner);

    const contract = new web3.eth.Contract(ABItoken.abi, contractAddress);

    try {
      const updatedGasPriceHex = web3.utils.toHex(parseInt(gasPrice));
      const data = contract.methods
        .mint(MintWallet, web3.utils.toWei(MintAmount, "ether"))
        .encodeABI();

      const tx = {
        from: ownerAddress,
        to: contractAddress,
        data: data,
        gas: gasLimitHex,
        gasPrice: updatedGasPriceHex,
      };

      const signedTx = await web3.eth.accounts.signTransaction(
        tx,
        privateKeyOwner
      );
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      console.log("done");
      var result = [];
      result.push(receipt.transactionHash);
      res.status(200).json({
        message: coverData(result),
      });
    } catch (error) {
      console.error("Error minting tokens:", error);
      res.status(500).json({ error: "Error minting tokens" });
    }
  }
  async control(req, res, next) {
    const check = req.user;
    try {
      res.render("admin/control", {
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
  async mintNft(req, res, next) {
    const { mintNft } = req.body;
    var ipfsCIDs;
    if (mintNft === "0xb4436D31E4Db1Ed2FC55262A93aF9D3b946fEE78") {
      ipfsCIDs = [
        "https://ipfs.io/ipfs/QmU2JJNVqUEi8TQM7Xruo1Lw9zezLRsKeLb94T7xczcw9N",
        "https://ipfs.io/ipfs/QmVLRHJnyLLN7VKjkot2ihdgZVdo3iBemLW1XGZZS8uH7Z",
        "https://ipfs.io/ipfs/QmViqf5Fuf6f7rbobpseXG7ocStymya2puA9s7bTRQRmRR",
        "https://ipfs.io/ipfs/QmcfAcofiNE1d3wxiWDbGkX8Nshsu7i6LvRJXC14TVykCj",
        "https://ipfs.io/ipfs/QmWEDPvWEow3FEmJsgRRipbmqCeCVMtP6mnVDQwDdZGeR5",
        "https://ipfs.io/ipfs/QmTQrdReQHAJDggtYjpwLcB5MY2Cg1hddxQC3wy4CW3zj4",
        "https://ipfs.io/ipfs/QmXY2akezJ6QsVqfqbyXzhgaobkw2cShfD4HfRmHcXtDAG",
        "https://ipfs.io/ipfs/QmXdvywRjzEYWgpbaQGznRPtTmgpSTQH8pafuHs2JoSDpy",
        "https://ipfs.io/ipfs/QmUEEWz69Un4JwDnmb4xntQXmYRVPhS1q3LcvaswYjPrLf",
      ];
    }
    if (mintNft === "0x6e20ab554CC44DFB46161a2923650393696a2Fd9") {
      ipfsCIDs = [
        "https://ipfs.io/ipfs/QmZwn4E1wrmCgkvxLfWSLyV8yhckRW2GJf4w79JY9JnNy2",
        "https://ipfs.io/ipfs/QmbA2TrBfDZGfvHJBy9p5D2znLfXrPyncktjykgjYQff9n",
        "https://ipfs.io/ipfs/QmeLjnmwhZhpRkwdAuA95NUiZPsoKcFULNTtiMArifRRsr",
        "https://ipfs.io/ipfs/QmPuMaqEnZJcszXsAJDckMB17nerKvLnk8t5zNRDEUyvFs",
        "https://ipfs.io/ipfs/QmZPcboRpJwDLA8Jm1yT2CDohaR63jH7sX4uuiJXbu32kX",
        "https://ipfs.io/ipfs/QmPWiZUqnsAgtmTR1KVjmfiGGxqQXRTXkkPCtKb5r5VYzp",
        "https://ipfs.io/ipfs/QmSexTqm2NRF6Y3iUPnRztTNRU67KNM9cjNkK6BgqU8rRK",
        "https://ipfs.io/ipfs/QmaqqkwCMFgjziKyWtrocCFKXwFoCuVd1izx2LkiCHYdBW",
        "https://ipfs.io/ipfs/QmVyHQhgypw9t4AXFmZQroZYKa4RvQ5fcMYMTETv6m5dj3",
      ];
    }
    if (mintNft === "0xecF6A5e7cC38f6044F8F9f0426aC6e0285d72f7A") {
      ipfsCIDs = [
        "https://ipfs.io/ipfs/QmWW7ELxC5yqbNWVYYum6d5dwmb39dis3u7oDayoLnraq2",
        "https://ipfs.io/ipfs/QmXi4wzYjGfqzi5AJWaD8sts2SejdBVT6o8a5MrR4D3Y3y",
        "https://ipfs.io/ipfs/QmenjW7gkwCKVUkzCes8Wdm76Wb9WtXmc8nt3M8nYdRZyj",
        "https://ipfs.io/ipfs/QmdcGfCLgfLCxow2aBBPh9RaAmcJXmXxY8xrXfz2DQ7Zyz",
        "https://ipfs.io/ipfs/QmeHdjAMwpdjTcuZZJfivHPLbsVmYoBHfbzxBgAVp3jZAL",
        "https://ipfs.io/ipfs/QmbUFmpnLAojVc7PBBEdc7NzgkMLCHhxSbBgATUzoLL9DJ",
        "https://ipfs.io/ipfs/QmTMvTND9DoeweYbukHk7oibRw5tWRnqwXrfrtpPi5rioS",
        "https://ipfs.io/ipfs/QmVuevp7EuiEYrfDhwGA97ZvDbrFgYmP9pzFuY41Uo854R",
        "https://ipfs.io/ipfs/QmNpZb8VaUovFvaTup8cqBd5mbBL7Wr9NxiXabASAA76FV",
        "https://ipfs.io/ipfs/QmYa3eQf3dLFiHKEcCucWbWt8ECK6Y9uCERCmWWGZEhvaz",
      ];
    }
    if (mintNft === "0x7F825645Fd9bD9279CDd078D40920a32a6e1B8B7") {
      ipfsCIDs = [
        "https://ipfs.io/ipfs/QmWN3kAhbDwtjad7TxEJ3LvQg71cG73J1y6TDgGB9WT59H",
        "https://ipfs.io/ipfs/QmQcFBxm5L4chRMxpDA2y1sT5PQ4WaF1jiuAhhLy5rKXAc",
        "https://ipfs.io/ipfs/QmPa9VgBzLNkruoGxqPRWvetqMQnTTbVj2CT6BYV4htzs6",
        "https://ipfs.io/ipfs/QmfHHTrZ2mnqLCJP7UNqtACXdzuoP2yUxYKkgksq4eTT6v",
        "https://ipfs.io/ipfs/Qma2guyqqMgGDwz92jphbd4y7Aefbc9edkfUv4f5dbXGsc",
        "https://ipfs.io/ipfs/QmTcz4QhWWYo9Yus5eHy94Ug3zFVnVtb4UCzioupseXuj3",
        "https://ipfs.io/ipfs/Qmbmw9vut6m3mFWhUqBcytoyrZ5jAAFEQy2zJufmPfH9TJ",
        "https://ipfs.io/ipfs/QmVzQSkyLk55BMuZWEH9Y6vyJHqWk6ZdAcnZt2ersxuhpd",
        "https://ipfs.io/ipfs/QmdyoJMcdPKVYnaFbyeuD3TjAWkKxKYbXQ5nye4qmsZYU6",
        "https://ipfs.io/ipfs/QmUrhJw5r1fuy8frsKM3o7278XhC1ttjeME3C1eSnSdNq5",
      ];
    }
    const privateKeyOwner = process.env.privateKeyhex.trim();
    const ownerAddress = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
    const SmartContact = mintNft;
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimitHex = "0x493e0";
    const accountOwner = web3.eth.accounts.privateKeyToAccount(privateKeyOwner);
    web3.eth.accounts.wallet.add(accountOwner);

    const contract = new web3.eth.Contract(ABINFT.abi, contractAddress);

    try {
      for (const cid of ipfsCIDs) {
        const tx = await contract.methods.mintByOwner(ownerAddress, cid).send({
          from: ownerAddress,
          gasPrice: gasPrice,
          gas: gasLimitHex,
        });
        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKeyOwner
        );
        const receipt = web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log("done");
        var result = [];
        result.push(receipt.transactionHash);
        res.status(200).json({
          message: coverData(result),
        });
      }
    } catch (e) {
      return res.send("error ");
    }
  }
  async settax(req, res, next) {
    try {
      const { taxBuy, taxSell } = req.body;
      const privateKeyOwner = process.env.privateKeyhex.trim();
      const ownerAddress = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
      const accountOwner =
        web3.eth.accounts.privateKeyToAccount(privateKeyOwner);
      web3.eth.accounts.wallet.add(accountOwner);

      const gasPrice = await web3.eth.getGasPrice();
      const gasLimitHex = "0x493e0";
      const gasPriceHex = web3.utils.toHex(gasPrice);

      const contractAddress = "0xF00aa648C743a0dfF310c62EaCe3dF9757A14Ef8";
      const contract = new web3.eth.Contract(ABITOKEN.abi, contractAddress);

      const txOptions = {
        gasPrice: gasPriceHex,
        gas: gasLimitHex,
        from: ownerAddress,
      };
      const resultBuyTax = await contract.methods
        .setBuyTax(taxBuy)
        .send(txOptions);

      const resultSellTax = await contract.methods
        .setSellTax(taxSell)
        .send(txOptions);

      res.status(200).json({
        message: coverData([
          resultBuyTax.transactionHash,
          resultSellTax.transactionHash,
        ]),
      });
    } catch (error) {
      console.error("Error setting tax:", error);
      res.status(500).json({ message: "Failed to update tax settings" });
    }
  }
  async unlockSell(req, res, next) {
    try {
      const privateKeyOwner = process.env.privateKeyhex.trim();
      const ownerAddress = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
      const accountOwner =
        web3.eth.accounts.privateKeyToAccount(privateKeyOwner);
      web3.eth.accounts.wallet.add(accountOwner);

      const gasPrice = await web3.eth.getGasPrice();
      const gasLimitHex = "0x493e0";
      const gasPriceHex = web3.utils.toHex(gasPrice);

      const contractAddress = "0xF00aa648C743a0dfF310c62EaCe3dF9757A14Ef8";
      const contract = new web3.eth.Contract(ABITOKEN.abi, contractAddress);

      const txOptions = {
        gasPrice: gasPriceHex,
        gas: gasLimitHex,
        from: ownerAddress,
      };

      const result = await contract.methods.unlockSell().send(txOptions);

      res.status(200).json({
        message: coverData([result.transactionHash]),
      });
    } catch (error) {
      console.error("Error unlocking sell:", error);
      res.status(500).json({ message: "Failed to unlock sell" });
    }
  }

  async lockSell(req, res, next) {
    try {
      const privateKeyOwner = process.env.privateKeyhex.trim();
      const ownerAddress = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
      const accountOwner =
        web3.eth.accounts.privateKeyToAccount(privateKeyOwner);
      web3.eth.accounts.wallet.add(accountOwner);

      const gasPrice = await web3.eth.getGasPrice();
      const gasLimitHex = "0x493e0";
      const gasPriceHex = web3.utils.toHex(gasPrice);

      const contractAddress = "0xF00aa648C743a0dfF310c62EaCe3dF9757A14Ef8";
      const contract = new web3.eth.Contract(ABITOKEN.abi, contractAddress);

      const txOptions = {
        gasPrice: gasPriceHex,
        gas: gasLimitHex,
        from: ownerAddress,
      };

      const result = await contract.methods.lockSell().send(txOptions);

      res.status(200).json({
        message: coverData([result.transactionHash]),
      });
    } catch (error) {
      console.error("Error locking sell:", error);
      res.status(500).json({ message: "Failed to lock sell" });
    }
  }
  async renounceOwnership(req, res, next) {
    try {
      const privateKeyOwner = process.env.privateKeyhex.trim();
      const ownerAddress = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
      const accountOwner =
        web3.eth.accounts.privateKeyToAccount(privateKeyOwner);
      web3.eth.accounts.wallet.add(accountOwner);
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimitHex = "0x493e0";

      const contractAddress = "0xF00aa648C743a0dfF310c62EaCe3dF9757A14Ef8";
      const contract = new web3.eth.Contract(ABITOKEN.abi, contractAddress);

      const result = await contract.methods
        .renounceOwnership()
        .send({ from: accountOwner.address, gas: gasLimitHex, gasPrice });
      res.status(200).json({
        message: coverData([result.transactionHash]),
      });
    } catch (error) {
      console.error("Error renouncing ownership:", error);
      res.status(500).json({ message: "Failed to renounce ownership" });
    }
  }

  async callBackOwnership(req, res, next) {
    try {
      const privateKeyOwner = process.env.privateKeyhex.trim();
      const ownerAddress = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
      const accountOwner =
        web3.eth.accounts.privateKeyToAccount(privateKeyOwner);
      web3.eth.accounts.wallet.add(accountOwner);
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimitHex = "0x493e0";

      const contractAddress = "0xF00aa648C743a0dfF310c62EaCe3dF9757A14Ef8";
      const contract = new web3.eth.Contract(ABITOKEN.abi, contractAddress);

      const result = await contract.methods
        .callBackOwnership()
        .send({ from: accountOwner.address, gas: gasLimitHex, gasPrice });

      res.status(200).json({
        message: coverData([result.transactionHash]),
      });
    } catch (error) {
      console.error("Error calling back ownership:", error);
      res.status(500).json({ message: "Failed to call back ownership" });
    }
  }
  async burn(req, res, next) {
    const { amount, wallet } = req.body;

    try {
      const privateKeyOwner = process.env.privateKeyhex.trim();
      const ownerAddress = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
      const accountOwner =
        web3.eth.accounts.privateKeyToAccount(privateKeyOwner);

      web3.eth.accounts.wallet.add(accountOwner);

      const contractAddress = "0xF00aa648C743a0dfF310c62EaCe3dF9757A14Ef8";
      const contractABI = [
        {
          inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "burn",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimitHex = "0x493e0";

      const burnFunction = contract.methods.burn(
        wallet,
        web3.utils.toWei(amount, "ether")
      );
      const encodedABI = burnFunction.encodeABI();

      const tx = {
        from: ownerAddress,
        to: contractAddress,
        gas: gasLimitHex,
        gasPrice: gasPrice,
        data: encodedABI,
      };

      const signedTx = await web3.eth.accounts.signTransaction(
        tx,
        privateKeyOwner
      );
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      res.status(200).json({
        message: coverData([receipt.transactionHash]),
      });
    } catch (error) {
      console.error("Error burning tokens:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AdminController();
