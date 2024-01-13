const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');

router.use(usersRouter);
router.use(moviesRouter);
router.all('/*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = router;
