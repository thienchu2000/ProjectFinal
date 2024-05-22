const homeRouter = require("./homeRouter");
const botTrendingRouter = require("./botTrendingRouter");
const botCheckRouter = require("./botCheckRouter");
const newsRouter = require("./newsRouter");
const adminRouter = require("./adminRouter");
const orderRouter = require("./orderRouter");
const checkLogin = require("../utils/checkLogin");

function router(app) {
  app.use("/order", checkLogin, orderRouter);
  app.use("/admin", adminRouter);
  app.use("/news", checkLogin, newsRouter);
  app.use("/botCheck", checkLogin, botCheckRouter);
  app.use("/botTrending", checkLogin, botTrendingRouter);
  app.use("/", homeRouter);
}

module.exports = router;
