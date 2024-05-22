const NewsCrypto = require("../models/NewsCrypto");

class NewsController {
  index(req, res, next) {
    var user = req.user;
    res.render("news", {
      User: true,
      Name: user.UserName,
    });
  }
  create(req, res, next) {
    var user = req.user;
    const { NameNew, Description } = req.body;
    var Image = req.file;
    const newscrypto = new NewsCrypto({
      NameNew: NameNew,
      Description: Description,
      Image: Image,
      User: user._id,
    });
  }
  async update(req, res, next) {
    const id = req.params.id;
    const { NameNew, Description } = req.body;
    var Image = req.file;
    try {
      NewsCrypto.findByIdAndUpdate(
        { _id: id },
        { NameNew: NameNew, Description: Description, Image: Image }
      );
    } catch (err) {
      res.send("Error updating");
    }
  }
}

module.exports = new NewsController();
