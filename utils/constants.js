const dbURL = 'mongodb://127.0.0.1:27017/bitfilmsdb';

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
];

module.exports = {
  dbURL,
  allowedCors,
};
