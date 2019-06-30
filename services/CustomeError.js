module.exports = class MError extends Error {
  /**
   *
   * @param {*} message message of error
   * @param {Number} code error code
   */
  constructor(message, code) {
    super();
    this.message = message;
    this.code = code;
  }
};
