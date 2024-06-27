const homeRouter = require("./homeRouter");
const botTrendingRouter = require("./botTrendingRouter");
const botCheckRouter = require("./botCheckRouter");
const newsRouter = require("./newsRouter");
const adminRouter = require("./adminRouter");
const orderRouter = require("./orderRouter");
const managerRouter = require("./managerRouter");
const nftRouter = require("./nftRouter");
const checkLogin = require("../utils/checkLogin");

function router(app) {
  app.use("/nft", checkLogin, nftRouter);
  app.use("/manager", checkLogin, managerRouter);
  app.use("/order", checkLogin, orderRouter);
  app.use("/admin", checkLogin, adminRouter);
  app.use("/news", checkLogin, newsRouter);
  app.use("/botCheck", checkLogin, botCheckRouter);
  app.use("/botTrending", checkLogin, botTrendingRouter);
  app.use("/", homeRouter);
}

module.exports = router;
