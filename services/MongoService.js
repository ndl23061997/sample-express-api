const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

var db_url = process.env.DATABASE_URL;
// Connect mongoose
mongoose.connect(db_url, { useNewUrlParser: true }, (err, succ) => {
  if (!err) console.log("database connect success");
  else console.log("Connect database failure", "\n", err);
});

module.exports = { mongoose };
