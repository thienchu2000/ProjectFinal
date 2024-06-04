const express = require("express");
const BotCheckController = require("../controllers/BotCheckController");
const router = express.Router();
const { checkPaymentSmart } = require("../utils/payment");
const checkLogin = require("../utils/checkLogin");

router.post("/check", checkLogin, checkPaymentSmart, BotCheckController.check);
router.get("/", checkLogin, checkPaymentSmart, BotCheckController.index);

module.exports = router;
