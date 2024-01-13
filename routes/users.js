const router = require('express').Router();

// Контроллеры роутов
const { getUserInfo, changeUserInfo, createUser } = require('../controllers/users');

router.get('/users/me', getUserInfo);
router.patch('/users/me', changeUserInfo);
router.post('/users', createUser);

module.exports = router;
