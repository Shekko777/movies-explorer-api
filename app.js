require('dotenv').config();
// Подключение модулей
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const appRouter = require('./routes/index');
const auth = require('./middlewares/auth');
const { createUser, loginUser, signOut } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

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
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger); // Сбор логов запроса

app.post('/signup', createUser);
app.post('/signin', loginUser);
app.use(auth);
app.use(appRouter);
app.post('/signout', signOut);

app.use(errorLogger); // Сбор логов ошибок

// Перехватывает ошибки из controllers
app.use((err, req, res, next) => {
  const errorMessage = err.message || 'На сервере произошла ошибка';
  const statusCode = err.statusCode || 500;

  res.status(statusCode).send({ message: errorMessage });
  next();
});

// Включение сервера
app.listen(PORT, () => {
  console.log(`server started in ${PORT} port`);
});
