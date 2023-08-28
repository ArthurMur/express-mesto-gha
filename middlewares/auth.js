/* eslint-disable consistent-return */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = process.env;

const handleAuthError = (res) => {
  res.status(401).send({ message: 'Необходима авторизация' });
};

const tokenVerify = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return '';
  }
};

module.exports = (req, res, next) => {
  const jwtSubstring = 'jwt=';
  const tokenIndex = req.headers.cookie.indexOf(jwtSubstring);
  let token = '';

  if (tokenIndex !== -1) {
    token = req.headers.cookie.slice(tokenIndex + jwtSubstring.length);
  }

  if (!token) {
    return handleAuthError(res);
  }
  const payload = tokenVerify(token);
  if (!payload) {
    handleAuthError(res);
  }

  req.user = payload;
  return next();
};
