const dbURL = 'mongodb://127.0.0.1:27017/bitfilmsdb';

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'localhost:3001',
  'http://localhost:3001',
  'http://127.0.0.1:3001',

];

module.exports = {
  dbURL,
  allowedCors,
};
