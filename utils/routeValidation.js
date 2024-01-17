const { Joi, celebrate } = require('celebrate');
const { mailRegex, linkRegex } = require('./regex');

// Валидация users роутов
const validationUserPatchInfo = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().pattern(mailRegex),
    name: Joi.string().min(2).max(30),
  }),
});

// Валидация movies роутов
const validationMovieCreation = () => celebrate({
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
});

const validationMovieRemoval = () => celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
});

// Валидация регистрации
const validationRegistration = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(mailRegex),
    password: Joi.string().required(),
  }),
});

// Валидация авторизации
const validationAuthorization = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(mailRegex),
    password: Joi.string().required(),
  }),
});

module.exports = {
  validationUserPatchInfo,
  validationMovieCreation,
  validationMovieRemoval,
  validationRegistration,
  validationAuthorization,
};
