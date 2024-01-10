require('dotenv').config();
const MovieModel = require('../models/movie');

// Ошибки
const ValidationError = require('../errors/ValidationError'); // 400 statusCode
const NotValidId = require('../errors/NotValidId'); // 404 statusCode

// возвращает все сохранённые текущим пользователем фильмы
module.exports.returnSavedMovies = (req, res, next) => {
  MovieModel.find()
    .then((movies) => {
      res.status(200).send({ movies });
    })
    .catch(next);
};

// создаёт фильм с переданными в теле данными
module.exports.createMovie = (req, res, next) => {
  MovieModel.create({
    country: req.body.country,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.body.image,
    trailer: req.body.trailer,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
    thumbnail: req.body.thumbnail,
    movieId: req.body.movieId,
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
};

// удаляет сохранённый фильм по id
module.exports.deleteMovieById = (req, res, next) => {
  MovieModel.findByIdAndDelete(req.params.id)
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
};
