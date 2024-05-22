const express = require("express");
const BotTrendingController = require("../controllers/BotTrendingController");
const router = express.Router();

router.get("/topPump", BotTrendingController.topPump);
router.get("/", BotTrendingController.index);

module.exports = router;
