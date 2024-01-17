const router = require('express').Router();
const { validationMovieCreation, validationMovieRemoval } = require('../utils/routeValidation');

// Контроллеры роутов
const { returnSavedMovies, createMovie, deleteMovieById } = require('../controllers/movies');

router.get('/movies', returnSavedMovies); // Получить все фильмы
router.post('/movies', validationMovieCreation(), createMovie); // Роут создания фильмов
router.delete('/movies/:id', validationMovieRemoval(), deleteMovieById); // Роут удаления фильмов

module.exports = router;
