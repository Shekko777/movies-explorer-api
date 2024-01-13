require('dotenv').config();
const bcrypt = require('bcrypt'); // Для хеширования пароля при регистрации
const jwt = require('jsonwebtoken'); // Для проверки токена при авторизации
const UserModel = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;

// Импорт ошибок
const NotValidId = require('../errors/NotValidId'); // 404 statusCode
const ValidationError = require('../errors/ValidationError'); // 400 statusCode
const BusyEmail = require('../errors/BusyEmail'); // 409 statusCode
const InvalidLogin = require('../errors/InvalidLogin');

// РЕГИСТРАЦИЯ : создаёт пользователя с переданными в теле данными
// Принимает: email, password, name
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
        next(new ValidationError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new BusyEmail('Пользователь с таким Email уже существует'));
      }
      next(err);
    });
};

// ЛОГИН : проверяет переданные в теле почту и пароль
module.exports.loginUser = (req, res, next) => UserModel.findOne({ email: req.body.email }).select('+password')
  // .orFail(new Error('InvalidLogin'))
  .then((user) => {
    if (!user) {
      throw new Error('InvalidLogin');
    }
    return bcrypt.compare(req.body.password, user.password)
      .then((matched) => {
        if (!matched) {
          next(new Error('InvalidLogin'));
        }
        return user;
      });
  })
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev_secret_key', { expiresIn: '7d' });
    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
    });
    req.headers.authorization = token;
    res.status(200).send({ jwt: token });
  })
  .catch((err) => {
    if (err.message === 'InvalidLogim') {
      next(new InvalidLogin('Неверный логин или пароль'));
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

// возвращает информацию о пользователе (email и имя)
module.exports.getUserInfo = (req, res, next) => UserModel.findOne({ _id: req.user._id })
  .orFail(new Error('NotValidId'))
  .then((user) => {
    res.status(200).send({ user });
  })
  .catch((err) => {
    if (err.message === 'NotValidId') {
      next(new NotValidId('Пользователь по такому id не найден'));
    } else {
      next(err);
    }
  });

// обновляет информацию о пользователе (email и имя)
module.exports.changeUserInfo = (req, res, next) => UserModel.findByIdAndUpdate(
  req.user._id,
  { email: req.body.email, name: req.body.name },
  { new: true, runValidators: true },
)
  .orFail(new Error('NotValidId'))
  .then((user) => {
    res.status(200).send({ user });
  })
  .catch((err) => {
    if (err.message === 'NotValidId') {
      next(new NotValidId('Пользователь по такому id не найден'));
    } else {
      next(err);
    }
  });
