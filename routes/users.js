const { celebrate, Joi } = require('celebrate'); // Для валидации запросов
const router = require('express').Router();
const { mailRegex } = require('../utils/regex'); // Регулярное выражение для проверки email

// Контроллеры роутов
const { getUserInfo, changeUserInfo } = require('../controllers/users');

router.get('/users/me', getUserInfo); // Получить инфо о своём аккаунте
router.patch('/users/me', celebrate({ // Частично изменить инфо
  body: Joi.object().keys({
    email: Joi.string().pattern(mailRegex),
    name: Joi.string().min(2).max(30),
  }),
}), changeUserInfo);

module.exports = router;
