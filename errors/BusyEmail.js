class BusyEmail extends Error {
  constructor(message) {
    super(message);
    this.name = 'BusyEmail';
    this.statusCode = 409;
  }
}

module.exports = BusyEmail;
