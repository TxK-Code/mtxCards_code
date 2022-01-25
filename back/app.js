const express = require("express");
require("dotenv").config();

const app = express();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const { key, iv } = require("./cryptoKey");

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
  const cardToDb = req.body.card;
  const idUserToCardToDb = req.body.token;
  // console.log(cardToDb, "HELLO");
  // console.log(JSON.parse(idUserToCardToDb).token, "Yo");

  // Check Token
  const checkToken = jwt.verify(
    JSON.parse(idUserToCardToDb).token,
    process.env.TOKEN_PASS
  );
  console.log(checkToken.cryptID);
  // Decrypt TokenData
  const decryptID = cryptoJS.AES.decrypt(checkToken.cryptID, key, {
    iv: iv,
  }).toString(cryptoJS.enc.Utf8);
  console.log(decryptID, "decryptID");
  // Check if card already in DB
  db.query(
    `SELECT * FROM card WHERE cardName = '${cardToDb.name}'`,
    function (err, result) {
      if (err) {
        throw err;
      }
      // If card already in DB
      if (result[0]) {
        console.log("Already added");
        const idToAdd = result[0].cardId;
        // Add card in User List
        db.query(
          `SELECT * FROM user WHERE id_User = '${decryptID}'`,
          function (err, result) {
            if (err) {
              throw err;
            }
            const getCardList = JSON.parse(result[0].userCardList);
            getCardList.push(`${idToAdd}`);
            db.query(
              `UPDATE user SET userCardList = JSON_ARRAY('${getCardList}');`
            );
          }
        );
      }
      // If not
      else {
        console.log("New Card");
        // Add Card into DB
        db.query(
          `INSERT INTO card (cardName, cardId, cardVisual, cardPrice, cardColor)
        VALUES ('${cardToDb.name}', '${cardToDb.id}', '${cardToDb.image_uris.normal}', '${cardToDb.prices.eur}', '${cardToDb.colors}')`,
          function (err, result) {
            const idToAdd = cardToDb.id;
            if (err) {
              throw err;
            }
            // Select User
            db.query(
              `SELECT * FROM user WHERE id_User = '${decryptID}'`,
              function (err, result) {
                if (err) {
                  throw err;
                }
                const getCardList = JSON.parse(result[0].userCardList);
                getCardList.push(`${idToAdd}`);
                // Add card Id to cardList
                db.query(
                  `UPDATE user SET userCardList = JSON_ARRAY('${getCardList}')`,
                  function (err, result) {
                    if (err) {
                      throw err;
                    }
                    res.status(200).json({
                      cardAdded: {
                        nameCard: cardToDb.name,
                        idCard: cardToDb.id,
                      },
                    });
                  }
                );
              }
            );
          }
        );
      }
    }
  );

  // db.query(
  //   `INSERT INTO card (cardName, cardId, cardVisual, cardPrice, cardColor)
  //     VALUES ('${cardToDb.name}', '${cardToDb.id}', '${cardToDb.image_uris.normal}', '${cardToDb.prices.eur}', '${cardToDb.colors}')`,
  //   function (err, result) {
  //     if (err) {
  //       throw err;
  //     }

  //     db.query(
  //       `SELECT * FROM card WHERE cardName = '${cardToDb.name}'`,
  //       function (err, result) {
  //         if (err) {
  //           throw err;
  //         }

  //         db.query(
  //           `SELECT * FROM user WHERE userName = 'K'`,
  //           function (err, result) {
  //             if (err) {
  //               throw err;
  //             }
  //             db.query(
  //               `UPDATE user SET userCards = concat(userCards, '') WHERE userName = ''`,
  //               function (err, result) {
  //                 if (err) {
  //                   throw err;
  //                 }
  //               }
  //             );
  //           }
  //         );
  //         console.log(result);
  //       }
  //     );

  //     res.status(200).json("Ok");
  //   }
  // );
});

// Login
app.post("/api/checkLoginInfos", (req, res, next) => {
  const infosUser = req.body;
  console.log("");
  console.log("User Data here :", infosUser);

  // Encrypt userName for search in DB

  const cryptUserName = cryptoJS.AES.encrypt(`${infosUser.userName}`, key, {
    iv: iv,
  }).toString();
  console.log(cryptUserName, "cryptUserName");
  const decryptUserName = cryptoJS.AES.decrypt(cryptUserName, key, {
    iv: iv,
  }).toString(cryptoJS.enc.Utf8);
  console.log(decryptUserName, "cryptUserName");

  // Look for user
  db.query(`SELECT * FROM user`, function (err, result) {
    if (err) {
      throw err;
    }

    // Crypt userId
    const cryptId = cryptoJS.AES.encrypt(`${result[0].id_User}`, key, {
      iv: iv,
    }).toString();

    // User found
    if (result[0] && result[0].userName === cryptUserName) {
      // Check password
      bcrypt.compare(
        infosUser.userPassword,
        result[0].userPassword,
        function (err, result) {
          if (err) {
            throw err;
          }
          // If passwords verification ok
          if (result === true) {
            res.status(200).json({
              userName: infosUser.userName,
              token: jwt.sign(
                {
                  userNameCrypt: cryptUserName,
                  cryptID: cryptId,
                },
                process.env.TOKEN_PASS,
                {
                  expiresIn: process.env.TOKEN_TIME_OUT,
                }
              ),
            });
          }
          if (result === false) {
            res.status(404).json("UserInfos not ok");
          }
        }
      );
    } else {
      console.log("User not Found or wrong Pass");
      res.status(404).json("UserInfos not ok");
    }
  });
});

// Signin
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
      key,
      {
        iv: iv,
      }
    ).toString();
    const decryptUserName = cryptoJS.AES.decrypt(cryptUserName, key, {
      iv: iv,
    }).toString(cryptoJS.enc.Utf8);

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
