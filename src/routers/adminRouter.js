const express = require("express");
const AdminController = require("../controllers/AdminController");
const router = express.Router();

router.get("/", AdminController.index);

module.exports = router;
