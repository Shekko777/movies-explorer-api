const router = require('express').Router();

// Контроллеры роутов
const { returnSavedMovies, createMovie, deleteMovieById } = require('../controllers/movies');

router.get('/movies', returnSavedMovies);
router.post('/movies', createMovie);
router.delete('/movies/:id', deleteMovieById);

module.exports = router;
