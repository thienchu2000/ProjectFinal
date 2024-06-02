const express = require("express");
const ManagerController = require("../controllers/ManagerController");
const router = express.Router();
const upload = require("../utils/multer");
const { isManager } = require("../utils/authenrize");

router.post("/createEmail", ManagerController.createEmail);
router.get("/sendEmail", ManagerController.sendEmail);
router.post("/updateNew/:id", upload, ManagerController.updateNew);
router.get("/managerData", ManagerController.FindData);
router.post("/CreateNews", upload, ManagerController.CreateNews);
router.get("/", isManager, ManagerController.index);

module.exports = router;
