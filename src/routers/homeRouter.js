const express = require("express");
const HomeController = require("../controllers/HomeController");
const router = express.Router();
const authentication = require("../utils/authentication");
const checkLogin = require("../utils/checkLogin");
const upload = require("../utils/multer");
const passport = require("passport");
const handleProfile = require("../utils/passport");
const passportMiddleware = require("../utils/passport");

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  HomeController.google
);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.post("/staking", checkLogin, HomeController.staking);
router.get("/orderr", checkLogin, HomeController.order);
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
