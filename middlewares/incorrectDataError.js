class IncorrectDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'IncorrectDataError ';
    this.statusCode = 401;
  }
}

module.exports = IncorrectDataError;
