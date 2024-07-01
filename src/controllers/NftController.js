const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");
const { Web3 } = require("web3");
const httpProvider = new Web3.providers.HttpProvider(process.env.infuraTest);
const web3 = new Web3(httpProvider);
const ABI1 = require("../contracts/WordLegendNFT_one.json");
const ABI2 = require("../contracts/WordLegendNFT_two.json");
const processReques = require("../utils/connect");
const connectToMetamask = require("../utils/connect");
const Payments = require("../models/Payments");
const Orders = require("../models/Orders");
const stringToHex = require("../utils/hex");
const Nfts = require("../models/Nfts");

class NftController {
  async index(req, res, next) {
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
    try {
      // 0xb4436D31E4Db1Ed2FC55262A93aF9D3b946fEE78
      // 0x6e20ab554CC44DFB46161a2923650393696a2Fd9
      // const contractAddressOne = "0x83Fdc7298F1C3b2dE23f56a770a6A895C4B4f0e9";
      // const contractAddressTwo = "0x7005c4Ea2ed532aA82C02176d5E84eC9b7704fFb";
      const contractAddressOne = "0xb4436D31E4Db1Ed2FC55262A93aF9D3b946fEE78";
      const contractAddressTwo = "0x6e20ab554CC44DFB46161a2923650393696a2Fd9";
      const tokenId1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const tokenId2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const contract1 = new web3.eth.Contract(ABI1.abi, contractAddressOne);
      const contract2 = new web3.eth.Contract(ABI2.abi, contractAddressTwo);

      const getTokenURIs = async (contract, tokenIds, contractAddress) => {
        return Promise.all(
          tokenIds.map(async (tokenId) => {
            const tokenURI = await contract.methods.tokenURI(tokenId).call();
            const response = await axios.get(tokenURI);
            return { ...response.data, tokenId, contractAddress };
          })
        );
      };
      const qy = await Nfts.find({ NameProduct: "Word Legend" });
      const metadata1 = await getTokenURIs(
        contract1,
        tokenId1,
        contractAddressOne
      );
      const metadata2 = await getTokenURIs(
        contract2,
        tokenId2,
        contractAddressTwo
      );
      const done = [];

      for (let i = 0; i < qy.length; i++) {
        var token = qy[i].SmartContact;
        for (let j = 0; j < metadata1.length; j++) {
          if (metadata1[j].contractAddress === token) {
            metadata1[j].qy = qy[i];
            done.push(metadata1[j]);
          }
        }
      }
      const done1 = [];

      for (let i = 0; i < qy.length; i++) {
        var token = qy[i].SmartContact;
        for (let j = 0; j < metadata2.length; j++) {
          if (metadata2[j].contractAddress === token) {
            metadata2[j].qy = qy[i];
            done.push(metadata2[j]);
          }
        }
      }
      res.render("minerNft", {
        metadata1: done,
        metadata2: done1,
        User: true,
        Name: user.UserName,
        manager: manager,
        admin: admin,
        Image: user.Image,
      });
    } catch (error) {
      console.error("Error fetching metadata:", error);
      next(error);
    }
  }

  async wordbest(req, res, next) {
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
    try {
      const contractAddressOne = "0x3C126dC085180801E1aD46790d8f3b3852A88f4a";
      const contractAddressTwo = "0xBa5597c6c66DD233ED33f8F89C215d2D7Ca174d4";
      const tokenId1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const tokenId2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const contract1 = new web3.eth.Contract(ABI1.abi, contractAddressOne);
      const contract2 = new web3.eth.Contract(ABI2.abi, contractAddressTwo);

      const getTokenURIs = async (contract, tokenIds, contractAddress) => {
        return Promise.all(
          tokenIds.map(async (tokenId) => {
            const tokenURI = await contract.methods.tokenURI(tokenId).call();
            const response = await axios.get(tokenURI);
            return { ...response.data, tokenId, contractAddress };
          })
        );
      };

      const qy = await Nfts.find({ NameProduct: "Word Best" });
      const metadata1 = await getTokenURIs(
        contract1,
        tokenId1,
        contractAddressOne
      );

      const metadata2 = await getTokenURIs(
        contract2,
        tokenId2,
        contractAddressTwo
      );
      const done = [];

      for (let i = 0; i < qy.length; i++) {
        var token = qy[i].SmartContact;
        for (let j = 0; j < metadata1.length; j++) {
          if (metadata1[j].contractAddress === token) {
            metadata1[j].qy = qy[i];
            done.push(metadata1[j]);
          }
        }
      }
      const done1 = [];

      for (let i = 0; i < qy.length; i++) {
        var token = qy[i].SmartContact;
        for (let j = 0; j < metadata2.length; j++) {
          if (metadata2[j].contractAddress === token) {
            metadata2[j].qy = qy[i];
            done.push(metadata2[j]);
          }
        }
      }

      res.render("wordBest", {
        metadata1: done,
        metadata2: done1,
        User: true,
        Name: user.UserName,
        manager: manager,
        admin: admin,
        Image: user.Image,
      });
    } catch (error) {
      console.error("Error fetching metadata:", error);
      next(error);
    }
  }

  async payment(req, res, next) {
    const user = req.user;
    const { contractAddress, tokenId, addressUser, txhash, nftId } = req.body;
    const ownerAddress = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
    const privateKey = process.env.privateKeyhex.trim();
    try {
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      web3.eth.accounts.wallet.add(account);
      const addressowner = account.address;
      const transactionStatus = await processReques(txhash);
      if (transactionStatus.status === 1n) {
        const contract = new web3.eth.Contract(ABI1.abi, contractAddress);
        const transferTx = await contract.methods
          .safeTransferFrom(ownerAddress, addressUser, tokenId)
          .send({ from: addressowner, gas: 1000000 });

        if (transferTx.status === 1n) {
          var data = { contractAddress: contractAddress, tokenId: tokenId };
          const payment = new Payments({
            User: user._id,
            Nft: nftId,
          });
          const idPay = await payment.save();
          const orders = new Orders({
            User: user._id,
            Nft: nftId,
            Payment: idPay._id,
            TokenId: tokenId,
            SmartContract: contractAddress,
          });
          await orders.save();
          return res.status(200).json(data);
        } else {
          return res.status(500).send("Failed to transfer NFT");
        }
      } else {
        return res.status(404).send("Transaction failed");
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
      return res.status(500).send(error.message);
    }
  }
}

module.exports = new NftController();
