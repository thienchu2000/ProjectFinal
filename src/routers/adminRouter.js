const express = require("express");
const AdminController = require("../controllers/AdminController");
const router = express.Router();
const checkLogin = require("../utils/checkLogin");

router.post("/burn", AdminController.burn);
router.post("/callBackOwnership", AdminController.callBackOwnership);
router.post("/renounceOwnership", AdminController.renounceOwnership);
router.post("/lockSell", AdminController.lockSell);
router.post("/unlockSell", AdminController.unlockSell);
router.post("/settax", AdminController.settax);
router.get("/control", AdminController.control);
router.post("/mintNFT", AdminController.mintNft);
router.post("/mintTk", AdminController.mintTk);
router.post("/volumFake", AdminController.volumFake);
router.get("/getOrder", AdminController.getOrder);
router.put("/createNft/:id", AdminController.createNft);
router.put("/createInforBot/:id", AdminController.createInforBot);
router.get("/inForBot", AdminController.getBot);
router.delete("/deleteNew/:id", AdminController.deleteNew);
router.put("/updateNews/:id", AdminController.updateNews);
router.get("/findNews", AdminController.findNews);
router.post("/createUser", AdminController.rigisterUser);
router.get("/createUser", AdminController.createUser);
router.delete("/delete/:id", AdminController.delete);
router.put("/update/:id", AdminController.update);
router.get("/", AdminController.index);

module.exports = router;
