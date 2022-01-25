const cryptojs = require("crypto-js");
require("dotenv").config();

const iv = cryptojs.enc.Base64.parse(process.env.CJS_IV);
const key = cryptojs.SHA256(process.env.CJS_KEY);

module.exports = { iv, key };
