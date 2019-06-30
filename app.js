var express = require("express");
var app = express();
var path = require("path");
// Load config from .env file
require("dotenv").config();
process.env.ROOT_PATH = __dirname;
//
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var router = require("./router");

Error.createError = (message, code) => {
  let error = new Error(message);
  error.message = message;
  error.code = code;
  return error;
};

// Create app instance

// parse application/x-www-form-urlencoded
var bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.json());

const MError = require("./services/CustomeError");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(router);

module.exports = app;
