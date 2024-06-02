const express = require("express");
const NewsController = require("../controllers/NewsController");
const router = express.Router();
const upload = require("../utils/multer");

router.get("/", NewsController.index);

module.exports = router;
