var express = require("express");
var router = express.Router();
var apiRouter = require("./routes/api/router");
// Route
router.use("/api", apiRouter);

module.exports = router;
