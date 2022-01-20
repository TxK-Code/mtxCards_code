const express = require("express");
require("dotenv").config();

const app = express();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cryptoJS = require("crypto-js");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
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

  db.query(
    `INSERT INTO card (cardName, cardId, cardVisual, cardPrice, cardColor)
      VALUES ('${cardToDb.name}', '${cardToDb.id}', '${cardToDb.image_uris.normal}', '${cardToDb.prices.eur}', '${cardToDb.colors}')`,
    function (err, result) {
      if (err) {
        throw err;
      }

      db.query(
        `SELECT * FROM card WHERE cardName = '${cardToDb.name}'`,
        function (err, result) {
          if (err) {
            throw err;
          }

          db.query(
            `SELECT * FROM user WHERE userName = 'K'`,
            function (err, result) {
              if (err) {
                throw err;
              }
              db.query(
                `UPDATE user SET userCards = concat(userCards, '') WHERE userName = ''`,
                function (err, result) {
                  if (err) {
                    throw err;
                  }
                }
              );
            }
          );
          console.log(result);
        }
      );

      // db.query(
      //   `SELECT * FROM user WHERE userName = 'K'`,
      //   function (err, result) {
      //     `UPDATE user SET userCards = concat(userCards, '') WHERE userName = ''`,
      //       function (err, result) {
      //         if (err) {
      //           throw err;
      //         }
      //       };
      //   }
      // );
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
      res.status(200).json("okUser");
    } else if (
      infosUser.userName === result[0].userName &&
      infosUser.userPassword != result[0].userPassword
    ) {
      res.status(403).json("koP");
    } else if (
      infosUser.userName != result[0].userName &&
      infosUser.userPassword === result[0].userPassword
    ) {
      res.status(403).json("koUn");
    }
  });
});

app.post("/api/addNewUser", (req, res, next) => {
  const infosNewUser = req.body;

  console.log("");
  console.log(infosNewUser);

  // If Data ok
  if (
    infosNewUser.userName !== null &&
    infosNewUser.userPassword !== null &&
    infosNewUser.userPasswordVerif !== null &&
    infosNewUser.userPassword === infosNewUser.userPasswordVerif
  ) {
    // Crypt userName
    const cryptUserName = cryptoJS.AES.encrypt(
      `${infosNewUser.userName}`,
      `${process.env.CJS}`
    ).toString();
    const decryptUserName = cryptoJS.AES.decrypt(
      cryptUserName,
      `${process.env.CJS}`
    ).toString(cryptoJS.enc.Utf8);

    // Crypt userPassword
    const cryptedPass = bcrypt.hashSync(infosNewUser.userPassword, 10);

    // Check new user isn't already into DB
    db.query(
      `SELECT * FROM user WHERE userName = "${infosNewUser.userName}"`,
      function (err, reslv) {
        if (err) {
          throw err;
        }

        // If ther is no other user with the same userName in DB
        if (reslv.length === 0) {
          // Add newUser to DB
          db.query(
            `INSERT INTO user (userName, userPassword) 
                  VALUES ('${cryptUserName}', '${cryptedPass}')`,
            function (err, result) {
              if (err) {
                throw err;
              }
              console.log("Hello Friend");
              res.status(200).json("OKnewUser");
            }
          );
        }

        // If user already exist in DB
        if (reslv[0]) {
          console.log("Acount already exist in DB");
          res.status(204).json("AF");
        }
      }
    );
  }
});

module.exports = app;
