require('dotenv').config();
// Подключение модулей
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const limiter = require('./utils/rateLimiter');
const appRouter = require('./routes/index');
const cors = require('cors');
// const checkCors = require('./middlewares/checkCors');
const { dbURL } = require('./utils/constants');

// Переменные окружения
// Если нет .env файла, они установятся по дефолту
const { NODE_ENV = 'dev', PORT = 3000, DB_ADDRESS } = process.env;

// Подключение к БД
mongoose.connect(NODE_ENV !== 'production' ? dbURL : DB_ADDRESS)
  .then(() => {
    console.log('mongo connected');
  })
  .catch((err) => {
    console.log(err);
  });

// Создание приложения
const app = express();
app.use(helmet()); // Модуль защиты заголовков
app.use(limiter); // Модуль контроля кол-ва запросов с одного ip
// app.use(checkCors); // Проверка CORS
app.use(cors());

app.use(express.json()); // Преобразование данных
app.use(cookieParser()); // Парсер куки

app.use(appRouter); // Все роуты приложения, сборы логов, обработки ошибок

// Включение сервера
app.listen(PORT, () => {
  console.log(`server started in ${NODE_ENV !== 'production' ? 3000 : PORT} port`);
});
