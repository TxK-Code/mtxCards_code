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

app.post("/api/cardToDb", (req, res, next) => {
  const cardToDb = req.body;

  console.log(cardToDb);

  db.query(
    `INSERT INTO card (cardName, cardId, cardVisual, cardPrice, cardColor)
      VALUES ('${cardToDb.name}', '${cardToDb.id}', '${cardToDb.image_uris.normal}', '${cardToDb.prices.eur}', '${cardToDb.colors}')`,
    function (err, result) {
      if (err) {
        throw err;
      }
      res.status(200).json("Ok");
    }
  );
});

app.post("/api/checkLoginInfos", (req, res, next) => {
  const infosUser = req.body;
  console.log("");
  console.log("User Data here :", infosUser);

  db.query(`SELECT * FROM user`, function (err, result) {
    if (err) {
      throw err;
    }

    if (
      infosUser.userName === result[0].userName &&
      infosUser.userPassword === result[0].userPassword
    ) {
      console.log("");
      console.log("UserInfos ok");
      res.status(200).json("okUser");
    } else if (
      infosUser.userName === result[0].userName &&
      infosUser.userPassword != result[0].userPassword
    ) {
      console.log("");
      console.log("UserInfos ko_p");
      res.status(403).json("koP");
    } else if (
      infosUser.userName != result[0].userName &&
      infosUser.userPassword === result[0].userPassword
    ) {
      console.log("");
      console.log("UserInfos ko_un");
      res.status(403).json("koUn");
    }
  });
});

module.exports = app;
