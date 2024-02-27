require('dotenv').config();
const bcrypt = require('bcrypt'); // Для хеширования пароля при регистрации
const jwt = require('jsonwebtoken'); // Для проверки токена при авторизации
const UserModel = require('../models/users'); // Модель пользователя

const { NODE_ENV = 'dev', JWT_SECRET = 'dev_secret_key' } = process.env;

// Импорт ошибок
const NotValidId = require('../errors/NotValidId'); // 404 statusCode
const ValidationError = require('../errors/ValidationError'); // 400 statusCode
const BusyEmail = require('../errors/BusyEmail'); // 409 statusCode
const InvalidLogin = require('../errors/InvalidLogin'); // 401 statusCode
const {
  errorMessageBusyEmail,
  errorMessageInvalidLogin,
  errorMessageNotValid,
  errorMessageValidationError,
} = require('../utils/errorMessages'); // Сообщения ошибок

// РЕГИСТРАЦИЯ : создаёт пользователя с переданными в теле данными
// Принимает: email, password, name
// Возвращает: email, name
module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => UserModel.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => {
      res.status(201).send({ email: user.email, name: user.name });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(errorMessageValidationError));
      } else if (err.code === 11000) {
        next(new BusyEmail(errorMessageBusyEmail));
      }
      next(err);
    });
};

// ЛОГИН : проверяет переданные в теле почту и пароль
// Принимает: email, password
// Возвращает: устанавливает jwt в res.cookie
module.exports.loginUser = (req, res, next) => UserModel.findOne({ email: req.body.email }).select('+password')
  .orFail(new Error('InvalidLogin'))
  .then((user) => bcrypt.compare(req.body.password, user.password)
    .then((matched) => {
      if (!matched) {
        throw new Error('InvalidLogin');
      }
      return user;
    }))
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev_secret_key', { expiresIn: '7d' });
    res.status(200).send({ jwt: token });
  })
  .catch((err) => {
    if (err.message === 'InvalidLogin') {
      next(new InvalidLogin(errorMessageInvalidLogin));
    } else {
      next(err);
    }
  });

// ВЫХОД : удаление jwt из cookies
module.exports.signOut = (req, res, next) => {
  res.clearCookie('jwt');
  res.status(200).send({ message: 'Ждём вас снова' });
  next();
};

// Возвращает информацию о пользователе по id: email, name
module.exports.getUserInfo = (req, res, next) => UserModel.findOne({ _id: req.user._id })
  .orFail(new Error('NotValidId'))
  .then((user) => {
    res.status(200).send({ email: user.email, name: user.name });
  })
  .catch((err) => {
    if (err.message === 'NotValidId') {
      next(new NotValidId(errorMessageNotValid));
    } else {
      next(err);
    }
  });

// Обновляет информацию о пользователе по id: email, name
// Принимает: email, name
// Возвращает: email, name
module.exports.changeUserInfo = (req, res, next) => UserModel.findByIdAndUpdate(
  req.user._id,
  { email: req.body.email, name: req.body.name },
  { new: true, runValidators: true },
)
  .orFail(new Error('NotValidId'))
  .then((user) => {
    res.status(200).send({ email: user.email, name: user.name });
  })
  .catch((err) => {
    if (err.message === 'NotValidId') {
      next(new NotValidId(errorMessageNotValid));
    } else if (err.code === 11000) {
      next(new BusyEmail(errorMessageBusyEmail));
    } else {
      next(err);
    }
  });
