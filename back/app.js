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

// Display all user cards
app.post("/api/allCards", (req, res, next) => {
  const userInfo = req.body;

  // Check user identity
  const checkToken = jwt.verify(userInfo.token, process.env.TOKEN_PASS);

  const decryptName = cryptoJS.AES.decrypt(checkToken.userNameCrypt, key, {
    iv: iv,
  }).toString(cryptoJS.enc.Utf8);
  const decryptId = cryptoJS.AES.decrypt(checkToken.cryptID, key, {
    iv: iv,
  }).toString(cryptoJS.enc.Utf8);

  // Identity ok, get userCardList
  if (userInfo.userName === decryptName) {
    db.query(
      `SELECT * FROM user WHERE id_User = '${decryptId}'`,
      function (err, result) {
        if (err) {
          throw err;
        }

        // Store userCardList
        const userCardsListed = JSON.parse(result[0].userCardList);
        const getIdsList = userCardsListed[0];
        const idsListed = `${getIdsList}`.split(",");
        const allUserCards = [];

        idsListed.map((e) => {
          allUserCards.push(`"${e}"`);
        });

        // Get Cards from DB
        db.query(
          `SELECT * FROM card WHERE cardId in (${allUserCards})`,
          function (err, result) {
            if (err) {
              throw err;
            }
            res.status(200).json(result);
          }
        );
      }
    );
  } else {
    res.status(404).json("UserInfos not ok");
  }
});

// Check Wallet Info
app.post("/api/wallet", (req, res, next) => {
  const idUser = req.body;

  // Check Token
  const checkToken = jwt.verify(idUser.token, process.env.TOKEN_PASS);
  // Decrypt TokenData
  const decryptID = cryptoJS.AES.decrypt(checkToken.cryptID, key, {
    iv: iv,
  }).toString(cryptoJS.enc.Utf8);

  // Look if collection is empty
  db.query(
    `SELECT * FROM user WHERE id_User = '${decryptID}'`,
    (err, result) => {
      if (err) {
        throw err;
      }
      console.log(result[0]);
      res.status(200).json(result[0]);
    }
  );
});

// Add card to DB
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
  // Decrypt TokenData
  const decryptID = cryptoJS.AES.decrypt(checkToken.cryptID, key, {
    iv: iv,
  }).toString(cryptoJS.enc.Utf8);
  // Check if card already in DB
  db.query(
    `SELECT * FROM card WHERE cardName = '${cardToDb.name}'`,
    function (err, result) {
      if (err) {
        throw err;
      }
      // If card already in DB
      if (result[0]) {
        const idToAdd = result[0].cardId;
        // Add card in User List
        db.query(
          `SELECT * FROM user WHERE id_User = '${decryptID}'`,
          function (err, result) {
            if (err) {
              throw err;
            }
            let getCardList = JSON.parse(result[0].userCardList);

            if (getCardList === null) {
              getCardList = [idToAdd];
            }

            getCardList.push(`${idToAdd}`);
            db.query(
              `UPDATE user SET userCardList = JSON_ARRAY('${getCardList}') WHERE id_User = '${decryptID}'`,
              function (err, result) {
                if (err) {
                  throw err;
                }
                res.status(200).json(result);
              }
            );
          }
        );
      }
      // If not
      else {
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
                let getCardList = JSON.parse(result[0].userCardList);

                if (getCardList === null) {
                  getCardList = [idToAdd];
                }

                getCardList.push(`${idToAdd}`);
                // Add card Id to cardList
                db.query(
                  `UPDATE user SET userCardList = JSON_ARRAY('${getCardList}') WHERE id_User = '${decryptID}'`,
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
});

// Login
app.post("/api/checkLoginInfos", (req, res, next) => {
  const infosUser = req.body;

  // Encrypt userName for search in DB

  const cryptUserName = cryptoJS.AES.encrypt(`${infosUser.userName}`, key, {
    iv: iv,
  }).toString();
  const decryptUserName = cryptoJS.AES.decrypt(cryptUserName, key, {
    iv: iv,
  }).toString(cryptoJS.enc.Utf8);

  // Look for user
  db.query(
    `SELECT * FROM user WHERE userName = '${cryptUserName}'`,
    function (err, result) {
      if (err) {
        throw err;
      }

      // User found
      if (result[0] && result[0].userName === cryptUserName) {
        // Crypt userId
        const cryptId = cryptoJS.AES.encrypt(`${result[0].id_User}`, key, {
          iv: iv,
        }).toString();
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
        res.status(404).json("UserInfos not ok");
      }
    }
  );
});

// Signin
app.post("/api/addNewUser", (req, res, next) => {
  const infosNewUser = req.body;

  // If Data ok
  if (
    infosNewUser.userName !== null &&
    infosNewUser.userPassword !== null &&
    infosNewUser.userPasswordVerif !== null &&
    infosNewUser.userPassword === infosNewUser.userPasswordVerif
  ) {
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
      `SELECT * FROM user WHERE userName = "${cryptUserName}"`,
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
              res.status(200).json("OKnewUser");
            }
          );
        }

        // If user already exist in DB
        if (reslv[0]) {
          res.status(404).json("AF");
        }
      }
    );
  }
});

app.post("/api/cardPrices", function (req, res, next) {
  const cryptUserName = cryptoJS.AES.encrypt(`${req.body.userName}`, key, {
    iv: iv,
  }).toString();

  db.query(
    `SELECT * FROM user WHERE userName = '${cryptUserName}'`,
    function (err, result) {
      if (err) {
        throw err;
      }

      let listIds = JSON.parse(result[0].userCardList);
      let arrayIds = `${listIds}`.split(",");
      let arrayPrices = [];

      arrayIds.forEach((card) => {
        db.query(
          `SELECT * FROM card WHERE cardId = '${card}'`,
          function (err, result) {
            if (err) {
              throw err;
            }
            arrayPrices.push(parseFloat(result[0].cardPrice));

            if (arrayPrices.length === arrayIds.length) {
              const reducer = (previousValue, currentValue) =>
                previousValue + currentValue;
              console.log(arrayPrices.reduce(reducer));
              res.status(200).json(arrayPrices.reduce(reducer));
            }
          }
        );
      });
    }
  );

  // const listLength = req.body.length;

  // req.body.forEach((item) => {
  //   db.query(
  //     `SELECT * FROM card WHERE cardId = '${item}'`,
  //     function (err, result) {
  //       if (err) {
  //         throw err;
  //       }

  //       let test = `${result[0].cardPrice}`;

  //       // console.log(test);
  //       priceArray.push(test);

  //       if (priceArray.length === listLength) {
  //         console.log(priceArray);
  //         res.status(200).json(JSON.stringify(priceArray));
  //       }
  //     }
  //   );
  // });
});

module.exports = app;
