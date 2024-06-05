const Payments = require("../models/Payments");

async function checkPaymentSmart(req, res, next) {
  const userId = req.user._id;

  try {
    const payment = await Payments.find({
      User: userId,
      Bot: "662e73b048a76f97cc260b7e",
    });
    const check = req.user;
    const checkRole = check.Role.NameRole;
    var admin;
    var manager;
    if (checkRole === "Admin") {
      admin = true;
    } else {
      admin = false;
    }
    if (checkRole === "Manager") {
      manager = true;
    } else {
      manager = false;
    }
    if (payment.length === 0) {
      return res.render("canPay", {
        User: true,
        Name: check.UserName,
        manager: manager,
        admin: admin,
        _id: check._id,
        Image: check.Image,
        back: "https://i.pinimg.com/originals/46/94/e6/4694e67882f40cf2b34b00bd31e469b2.png",
      });
    }
    if (payment) {
      var checkpayment = await payment.map((item) => {
        return item.createdAt;
      });
      var checktime = await checkpayment.filter((item) => {
        const currentDate = new Date();
        var newdateTime = currentDate.getTime();
        var timeCreact = item.getTime();
        var cover = (newdateTime - timeCreact) / (3600 * 1000 * 24);
        console.log(cover);
        return cover < 30;
      });
      next();
    } else {
      return res.status(403).send({
        message:
          "Thời gian sử dụng đã hết hạn. Vui lòng mua thêm thời gian để tiếp tục sử dụng dịch vụ.",
      });
    }
  } catch (error) {
    console.error("Lỗi kiểm tra thanh toán:", error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi kiểm tra thanh toán." });
  }
}

async function checkPaymentTrending(req, res, next) {
  const userId = req.user._id;
  const check = req.user;
  const checkRole = check.Role.NameRole;
  var admin;
  var manager;
  if (checkRole === "Admin") {
    admin = true;
  } else {
    admin = false;
  }
  if (checkRole === "Manager") {
    manager = true;
  } else {
    manager = false;
  }

  try {
    const payment = await Payments.find({
      User: userId,
      Bot: "662e74d348a76f97cc260b7f",
    });

    if (
      payment === null ||
      payment === undefined ||
      (Array.isArray(payment) && payment.length === 0)
    ) {
      return res.render("canPay", {
        User: true,
        Name: check.UserName,
        manager: manager,
        admin: admin,
        _id: check._id,
        Image: check.Image,
        back: "https://i.pinimg.com/originals/46/94/e6/4694e67882f40cf2b34b00bd31e469b2.png",
      });
    }
    if (payment) {
      var checkpayment = await payment.map((item) => {
        return item.createdAt;
      });
      var checktime = await checkpayment.filter((item) => {
        const currentDate = new Date();
        var newdateTime = currentDate.getTime();
        var timeCreact = item.getTime();
        var cover = (newdateTime - timeCreact) / (3600 * 1000 * 24);
        console.log(cover);
        return cover < 30;
      });
      next();
    } else {
      return res.status(403).send({
        message:
          "Thời gian sử dụng đã hết hạn. Vui lòng mua thêm thời gian để tiếp tục sử dụng dịch vụ.",
      });
    }
  } catch (error) {
    console.error("Lỗi kiểm tra thanh toán:", error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi kiểm tra thanh toán." });
  }
}

module.exports = { checkPaymentSmart, checkPaymentTrending };
