const { rateLimit } = require('express-rate-limit');

// Разрешено 20 запросов в 2 минуты
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

module.exports = limiter;
