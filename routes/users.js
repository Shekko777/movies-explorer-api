const router = require('express').Router();
const { validationUserPatchInfo } = require('../utils/routeValidation'); // Функция валидатор

// Контроллеры роутов
const { getUserInfo, changeUserInfo } = require('../controllers/users');

router.get('/users/me', getUserInfo); // Получить инфо о своём аккаунте
router.patch('/users/me', validationUserPatchInfo(), changeUserInfo); // Частичное изминение аккаунта

module.exports = router;
