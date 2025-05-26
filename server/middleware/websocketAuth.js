const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const SECRET = process.env.KEY_token || "default_secret";

const verifyTokenSocket = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, user) => {
      if (err) return reject("Token không hợp lệ");
      resolve(user);
    });
  });
};

module.exports = { verifyTokenSocket };
