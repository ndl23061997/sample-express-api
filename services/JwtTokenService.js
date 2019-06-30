const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;
var tokenExpires = Number(process.env.TOKEN_EXPIRES) || 3600;
/**
 * Get Login info from token
 * @param {any} payload Data to sign
 */
function sign(payload) {
  payload.expriesAt = Date.now() + tokenExpires * 1000;
  return {
    token: jwt.sign(payload, jwt_secret, { expiresIn: tokenExpires }),
    expriesAt: payload.expriesAt,
    expiresIn: tokenExpires * 1000
  };
}

/**
 *
 * @param  {string} token Token of user
 */
function verify(token) {
  return jwt.verify(token, jwt_secret);
}

module.exports = { jwt, sign, verify };
