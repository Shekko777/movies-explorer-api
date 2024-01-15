const { errorMessageDefault } = require('../utils/errorMessages');

const centralizedErrorHandler = (err, req, res, next) => {
  const errorMessage = err.message || errorMessageDefault;
  const statusCode = err.statusCode || 500;

  res.status(statusCode).send({ message: errorMessage });
  next();
};

module.exports = centralizedErrorHandler;
