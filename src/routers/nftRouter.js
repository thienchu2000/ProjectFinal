const express = require("express");
const NftController = require("../controllers/NftController");
const router = express.Router();
const upload = require("../utils/multer");

router.post("/payment", NftController.payment);
router.get("/wordbest", NftController.wordbest);
router.get("/", NftController.index);

module.exports = router;
