const express = require("express");
const router = require("./routers/router");
const bodyParser = require("body-parser");
const cors = require("cors");
const database = require("./config/database");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const { create } = require("express-handlebars");
const solc = require("solc");
const Crawler = require("crawler");
const { Web3 } = require("web3");
const { emit } = require("process");
const multer = require("multer");
const EventEmitter = require("eventemitter3");

var EE = new EventEmitter(),
  context = { foo: "bar" };

const app = express();
const port = 3000;
const exphbs = create({
  extname: ".hbs",
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  },
});

dotenv.config();

const httpProvider = new Web3.providers.HttpProvider(process.env.infura);
const web3 = new Web3(httpProvider);

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router(app);

app.use(express.static(__dirname + "/public"));
app.engine("hbs", exphbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.listen(port, async () => {
  await database.connect("Mongodb connected");
  console.log(`Run server on http://localhost:${port}`);
});
