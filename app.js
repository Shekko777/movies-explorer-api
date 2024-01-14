require('dotenv').config();
// Подключение модулей
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./utils/rateLimiter');
const appRouter = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const allowedCors = require('./utils/allowedCors');

// Переменные окружения
// Если нет .env файла, они установятся по дефолту
const { NODE_ENV, PORT, DB_ADDRESS } = process.env;

// Подключение к БД
mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : 'mongodb://127.0.0.1:27017/bitfilmsdb')
  .then(() => {
    console.log('mongo connected');
  })
  .catch((err) => {
    console.log(err);
  });

// Создание приложения
const app = express();
app.use(helmet());
app.use(limiter);

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
});

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger); // Сбор логов запроса

app.use(appRouter); // Все роуты приложения

app.use(errorLogger); // Сбор логов ошибок

// ОШИБКИ
// Перехват ошибок из celebrate
app.use(errors());
// Перехватывает ошибки из controllers
app.use((err, req, res, next) => {
  console.log(err);
  const errorMessage = err.message || 'На сервере произошла ошибка';
  const statusCode = err.statusCode || 500;

  res.status(statusCode).send({ message: errorMessage });
  next();
});

// Включение сервера
app.listen(PORT, () => {
  console.log(`server started in ${NODE_ENV === 'production' ? PORT : 3000} port`);
});
