const router = require('express').Router();
const { errors } = require('celebrate'); // Перехват ошибок celebrate
const usersRouter = require('./users'); // Users роуты
const moviesRouter = require('./movies'); // Movies роуты
const auth = require('../middlewares/auth'); // Проверка на авторизованность
const centralizedErrorHandler = require('../middlewares/centralizedErrorHandler'); // Мидлвар ошибок
const { requestLogger, errorLogger } = require('../middlewares/logger'); // Сбор логов, модуль winston
const { validationRegistration, validationAuthorization } = require('../utils/routeValidation'); // Валидация роутов

// Контроллеры роутов
const { createUser, loginUser, signOut } = require('../controllers/users'); // зарегистрироваться, залогиниться, выйти

router.use(requestLogger); // Сбор логов запроса. До роутов

// РОУТЫ
router.post('/signup', validationRegistration(), createUser); // Роут регистрации
router.post('/signin', validationAuthorization(), loginUser); // Роут авторизации
router.use(auth); // Проверка авторизованности пользователя
router.use(usersRouter); // Пользовательские роуты
router.use(moviesRouter); // Роуты для фильмов
router.post('/signout', signOut); // (выход) роут для удаления токена из cookie

router.all('/*', (req, res) => { // Роут для несуществующих запросов
  res.status(404).send({ message: 'Страница не найдена' });
});

router.use(errorLogger); // Сбор логов ошибок. После роутов

// ОШИБКИ
router.use(errors()); // Перехват ошибок из celebrate
router.use(centralizedErrorHandler); // Централизованный обработчик ошибок

module.exports = router;
