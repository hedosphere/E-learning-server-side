// require = require('esm')('module')
// module.exports = require('./index')
import express from "express";
import cors from "cors";
const morgan = require("morgan");
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import csrf from "csurf";
require("dotenv").config();

import { readdirSync } from "fs";
const csrfProtection = csrf({ cookie: true });
const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "7mb" }));
app.use(cors());
app.use(morgan("dev"));

mongoose
  .connect(process.env.MONGOOS)
  .then((e) => {
    console.log(">> mongo connect successfully >>");
  })
  .catch((err) => {
    console.log("&& mongo not connect &&");
  });
// const b = [1, 5, 4, 2, 8, 3, 6, 7];
// const k = b.slice(1, 3);
// b.splice(0, 1);
// console.log("splice", b);

// let objx = { title: "title", lesson: [1, "a", 2, 3, "b", "c"] };

// objx.pull(lesson[1]);
// console.log("slice", objx);

//

//

// Example:

// console.log(between(1, 9));

//

//

readdirSync("./router").map((t) => app.use("/api", require("./router/" + t)));

app.use(csrfProtection);

app.get("/api/get-csrf-token", function (req, res) {
  return res.json({ csrfToken: req.csrfToken() });
});

app.use("/", (req, res) => {
  res.send(
    "all the way from backend SOMETHING IS WRONG IT SHOULDN'T REACH HERE"
  );
});

const port = process.env.PORT || 8000;

app.listen(port, (p) => {
  console.log("");
});
// console.log(port);
