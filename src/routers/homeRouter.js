const express = require("express");
const HomeController = require("../controllers/HomeController");
const router = express.Router();
const authentication = require("../utils/authentication");
const checkLogin = require("../utils/checkLogin");
const upload = require("../utils/multer");

router.post("/changeImg", checkLogin, upload, HomeController.changeImg);
router.post("/changeUser", checkLogin, HomeController.changeUser);
router.get("/change", checkLogin, HomeController.change);
router.get("/findUser", checkLogin, HomeController.findUser);
router.get("/about", checkLogin, HomeController.getAbout);
router.post("/login", HomeController.login);
router.post("/register", HomeController.register);
router.get("/rg", HomeController.rg);
router.get("/logout", HomeController.logout);
router.get("/", authentication, HomeController.index);

module.exports = router;
