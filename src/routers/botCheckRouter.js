const express = require("express");
const BotCheckController = require("../controllers/BotCheckController");
const router = express.Router();

router.post("/check", BotCheckController.check);
router.get("/", BotCheckController.index);

module.exports = router;
