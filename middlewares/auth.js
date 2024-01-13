require('dotenv').config();
const jwt = require('jsonwebtoken');

// Ошибки
const InvalidLogin = require('../errors/InvalidLogin');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new InvalidLogin('Необходима авторизация'));
  }

  const token = req.cookies.jwt || authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev_secret_key');
  } catch (err) {
    next(new InvalidLogin('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
