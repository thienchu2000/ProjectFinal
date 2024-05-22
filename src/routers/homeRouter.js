const express = require("express");
const HomeController = require("../controllers/HomeController");
const router = express.Router();
const authentication = require("../utils/authentication");
const checkLogin = require("../utils/checkLogin");

router.get("/about", HomeController.getAbout);
router.post("/login", HomeController.login);
router.post("/register", HomeController.register);
router.get("/rg", HomeController.rg);
router.get("/logout", HomeController.logout);
router.get("/", authentication, HomeController.index);

module.exports = router;
