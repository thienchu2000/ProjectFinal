const express = require("express");
const BotTrendingController = require("../controllers/BotTrendingController");
const router = express.Router();
const { checkPaymentTrending } = require("../utils/payment");
const checkLogin = require("../utils/checkLogin");

router.get(
  "/topPump",
  checkLogin,
  checkPaymentTrending,
  BotTrendingController.topPump
);
router.get("/get", checkLogin, BotTrendingController.get);
router.get("/", checkLogin, checkPaymentTrending, BotTrendingController.index);

module.exports = router;
