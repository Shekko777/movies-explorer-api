require('dotenv').config();
const MovieModel = require('../models/movies'); // Модель фильмов

// Ошибки
const ValidationError = require('../errors/ValidationError'); // 400 statusCode
const NotValidId = require('../errors/NotValidId'); // 404 statusCode
const Forbidden = require('../errors/Forbidden'); // 403 statusCode

// Возвращает все сохранённые текущим пользователем фильмы
module.exports.returnSavedMovies = (req, res, next) => MovieModel.find()
  .populate('owner')
  .then((movies) => {
    res.status(200).send(movies);
  })
  .catch(next);

// Создаёт фильм с переданными в теле данными
module.exports.createMovie = (req, res, next) => MovieModel.create({
  country: req.body.country,
  director: req.body.director,
  duration: req.body.duration,
  year: req.body.year,
  description: req.body.description,
  image: req.body.image,
  trailerLink: req.body.trailerLink,
  thumbnail: req.body.thumbnail,
  movieId: req.body.movieId,
  nameRU: req.body.nameRU,
  nameEN: req.body.nameEN,
  owner: req.user._id, // <= Заполняется не из тела запроса
})
  .then((movie) => {
    res.status(201).send({ movie });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы неккоректные данные'));
    } else {
      next(err);
    }
  });

// Удаляет сохранённый фильм по id
module.exports.deleteMovieById = (req, res, next) => MovieModel.findById(req.params.id)
  .orFail(new Error('NotValidId'))
  .then((movie) => {
    if (movie.owner._id.toString() === req.user._id) {
      MovieModel.findByIdAndDelete(req.params.id)
        .populate('owner')
        .orFail(new Error('NotValidId'))
        .then((deletedMovie) => {
          res.status(200).send({ deletedMovie });
        })
        .catch((err) => {
          if (err.message === 'NotValidId') {
            next(new NotValidId('Фильм с указанными id не найдена'));
          } else if (err.name === 'CastError') {
            next(new ValidationError('Невалидный id фильма'));
          } else {
            next(err);
          }
        });
    } else {
      next(new Forbidden('Отказано в доступе'));
    }
  })
  .catch((err) => {
    if (err.message === 'NotValidId') {
      next(NotValidId('Фильм с указанными id не найдена'));
    } else {
      next(err);
    }
  });
