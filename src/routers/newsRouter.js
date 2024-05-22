const express = require("express");
const NewsController = require("../controllers/NewsController");
const router = express.Router();
const upload = require("../utils/multer");

router.put("/update/:id", upload, NewsController.update);
router.post("/create", upload, NewsController.create);
router.get("/", NewsController.index);

module.exports = router;
