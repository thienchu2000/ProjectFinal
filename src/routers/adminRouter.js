const express = require("express");
const AdminController = require("../controllers/AdminController");
const router = express.Router();
const checkLogin = require("../utils/checkLogin");

router.delete("/deleteNew/:id", AdminController.deleteNew);
router.put("/updateNews/:id", AdminController.updateNews);
router.get("/findNews", AdminController.findNews);
router.post("/createUser", AdminController.rigisterUser);
router.get("/createUser", AdminController.createUser);
router.delete("/delete/:id", AdminController.delete);
router.put("/update/:id", AdminController.update);
router.get("/", AdminController.index);

module.exports = router;
