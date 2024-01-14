require('dotenv').config();
// Подключение модулей
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const appRouter = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const allowedCors = require('./utils/allowedCors');

// Переменные окружения
const { PORT } = process.env;

// Подключение к БД
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb')
  .then(() => {
    console.log('mongo connected');
  })
  .catch((err) => {
    console.log(err);
  });

// Создание приложения
const app = express();

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
  console.log(`server started in ${PORT} port`);
});
