var express = require("express");
var router = express.Router();
var auth = require("../../services/AuthSerivce");
// Route
router.use("/auth", require("./auth"));
router.use("/upload", auth.getUserInfo, require("./upload"));
router.use("/file", require("./file"));
module.exports = router;
