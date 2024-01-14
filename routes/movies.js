const { celebrate, Joi } = require('celebrate'); // Для валидации запросов
const router = require('express').Router();
const { linkRegex } = require('../utils/regex'); // Регулярное выражение для проверки ссылок

// Контроллеры роутов
const { returnSavedMovies, createMovie, deleteMovieById } = require('../controllers/movies');

router.get('/movies', returnSavedMovies); // Получить все фильмы
router.post('/movies', celebrate({ // Добавить фильм
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(linkRegex),
    trailerLink: Joi.string().required().pattern(linkRegex),
    thumbnail: Joi.string().required().pattern(linkRegex),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/movies/:id', celebrate({ // Удалить фильм
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
}), deleteMovieById);

module.exports = router;
