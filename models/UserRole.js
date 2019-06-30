const { mongoose } = require("../services/MongoService");

var Schema = mongoose.Schema;
var schema = new Schema({
  value: {
    type: String,
    unique: true,
    required: true
  },
  name: String,
  created: { type: Date, default: Date.now() }
});

var UserRole = mongoose.model("UserRole", schema);
function addUserRole({ value, name }) {
  let userRole = new UserRole({ value, name });
  return userRole.save();
}

module.exports = { ...UserRole, addUserRole };
