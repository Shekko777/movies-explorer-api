require('dotenv').config();
const UserModel = require('../models/user');

// Импорт ошибок
const NotValidId = require('../errors/NotValidId'); // 404 statusCode

// возвращает информацию о пользователе (email и имя)
module.exports.getUserInfo = (req, res, next) => {
  UserModel.findOne({ _id: req.user._id })
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
};

// обновляет информацию о пользователе (email и имя)
module.exports.changeUserInfo = (req, res, next) => {
  UserModel.findByIdAndUpdate(
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
};
