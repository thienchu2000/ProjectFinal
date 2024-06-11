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
const QRCode = require("qrcode");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const { setResult, getResult } = require("./utils/ws");
const { getRe } = require("./utils/ws1");

const handlebars = require("handlebars");
const EventEmitter = require("events");
EventEmitter.defaultMaxListeners = 50;

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);

const exphbs = create({
  helpers: require("./utils/helpers"),
  extname: ".hbs",
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  },
});

handlebars.registerHelper("isEqualTrue", function (value, options) {
  return value === "true" ? options.fn(this) : options.inverse(this);
});
dotenv.config();

const httpProvider = new Web3.providers.HttpProvider(process.env.infura);
const web3 = new Web3(httpProvider);

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.io = io;
  next();
});

router(app);

app.use(express.static(__dirname + "/public"));
app.engine("hbs", exphbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// app.listen(port, async () => {
//   await database.connect("Mongodb connected");
//   console.log(`Run server on http://localhost:${port}`);
// });

server.listen(port, async () => {
  await database.connect("Mongodb connected");
  console.log(`Run server on http://localhost:${port}`);
});
