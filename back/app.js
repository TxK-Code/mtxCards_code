const express = require("express");

const app = express();
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1F3phLo7Qx",
  database: "mtx_cards",
});

const bodyParser = require("body-parser");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

app.post("/api/allCards", (req, res, next) => {
  db.query(`SELECT * FROM card`, function (err, result) {
    if (err) {
      throw err;
    }
    res.status(200).json(result);
  });
});

module.exports = app;
