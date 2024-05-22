const express = require("express");
const OrderControlle = require("../controllers/OrderController");
const router = express.Router();

router.post("/payment", OrderControlle.payment);
router.get("/", OrderControlle.index);

module.exports = router;
