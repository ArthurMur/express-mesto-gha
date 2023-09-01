/* eslint-disable consistent-return */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET = 'JWT_SECRET' } = process.env;

const AuthorizationError = require('../errors/authorizationError');

const tokenVerify = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return '';
  }
};

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new AuthorizationError('Неправильные почта или пароль'));
  }
  const payload = tokenVerify(token);
  if (!payload) {
    return next(new AuthorizationError('Неправильные почта или пароль'));
  }

  req.user = payload;
  return next();
};
