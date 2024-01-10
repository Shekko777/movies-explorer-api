require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { PORT } = process.env;

// Подключение к БД
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('mongod connected');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());

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
