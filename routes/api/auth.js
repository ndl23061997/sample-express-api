var express = require("express");
var router = express.Router();
var User = require("../../models/User");
//
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
//
const jwt = require("../../services/JwtTokenService");
const tokenService = require("../../services/TokenServices");
//
const auth = require("../../services/AuthSerivce");

// Route
router.get("/user", auth.getUserInfo, getUserInfo);
router.post("/login", postLogIn);
router.post("/signup", postSignUp);
router.get("/refresh-token", auth.getUserInfo, getRefreshToken);
// Function
async function getUserInfo(req, res) {
  console.log(req.user);
  delete req.user.password;
  return res.json(req.user || {});
}

async function getRefreshToken(req, res, next) {
  try {
    // Xoa token cu
    tokenService.removeToken(req.token);
    let user = req.user;
    // Tao token moi cho user
    let payload = { email: user.email };
    let { token, expiresIn, expriesAt } = jwt.sign(payload);
    let result = { token, expiresIn, expriesAt, role: user.role };
    tokenService.addToken(token);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function postLogIn(req, res, next) {
  let { email, password } = req.body;
  let user = await User.getUser({ email });

  try {
    if (user) {
      if (user.isBlock) throw MError.createError("Account is blocked", 401);
      // Check password
      console.log(password, user.password);
      let same = bcrypt.compareSync(password, user.password);
      console.log(same);
      if (same) {
        // Login success
        // Create Token for user
        let payload = { email: user.email };
        let { token, expiresIn, expriesAt } = jwt.sign(payload);
        let result = { token, expiresIn, expriesAt, role: user.role };
        tokenService.addToken(token);
        return res.json(result);
      } else {
        // Password not match
        throw Error.createError("Password not match", 401);
      }
    } else {
      // Không tồn tại user
      throw Error.createError("Account not exits", 401);
    }
  } catch (error) {
    // MError handle
    return next(error);
  }
}

async function postSignUp(req, res, next) {
  let { email, password, info, role } = req.body;
  password = bcrypt.hashSync(password, salt);
  try {
    let user = await User.addUser({ email, password, info, role });
    return res.json(user);
  } catch (error) {
    // MError handle
    return next(error);
  }
}
module.exports = router;
