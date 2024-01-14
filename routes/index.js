const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // Для валидации запросов
const usersRouter = require('./users'); // Users роуты
const moviesRouter = require('./movies'); // Movies роуты
const auth = require('../middlewares/auth'); // Проверка на авторизованность
const { mailRegex } = require('../utils/regex'); // Регулярное выражение для проверки email

// Контроллеры роутов
const { createUser, loginUser, signOut } = require('../controllers/users'); // зарегистрироваться, залогиниться, выйти

router.post('/signup', celebrate({ // Роутер регистрации
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(mailRegex),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', celebrate({ // Роутер логирования
  body: Joi.object().keys({
    email: Joi.string().required().pattern(mailRegex),
    password: Joi.string().required(),
  }),
}), loginUser);

router.use(auth); // Проверка авторизованности пользователя
router.use(usersRouter); // Пользовательские роуты
router.use(moviesRouter); // Роуты для фильмов
router.post('/signout', signOut); // (выход) роут для удаления токена из cookie

router.all('/*', (req, res) => { // Роут для несуществующих запросов
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = router;
