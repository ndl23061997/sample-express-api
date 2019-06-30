const { mongoose } = require("../services/MongoService");
const validator = require("validator");
const UserInfo = require("./UserInfo");
const UserRole = require("./UserRole");
var Schema = mongoose.Schema;
var schema = new Schema({
  password: String,
  email: {
    type: String,
    validate: {
      validator: v => {
        return validator.isEmail(v);
      }
    },
    unique: true
  },
  role: [
    {
      type: Schema.Types.ObjectId,
      ref: "UserRole"
    }
  ],
  info: {
    type: Schema.Types.ObjectId,
    ref: "UserInfo",
    required: false
  },
  isBlock: {
    type: Boolean,
    default: true,
    required: true
  },
  created: { type: Date, default: Date.now() }
});

var User = mongoose.model("User", schema);
async function addUser({ email, password, info, role }) {
  //   if (!validator.isEmail(email)) throw new Error("Email invalid");
  let user = new User({ email, password });
  user.role = role;
  if (info) {
    let userInfo = await UserInfo.addUserInfo(info);
    user.info = userInfo._id;
  }
  return user.save();
}

async function getUser({ _id, email }) {
  let query = {};
  if (_id) query._id = _id;
  if (email) query.email = email;
  if (query === {}) return null;
  let user = await User.findOne(query)
    .populate("info")
    .populate("role")
    .lean();
  user.role = user.role.map(e => e.value);
  return user;
}

async function updateUser(_id, { role, isBlock, password, info }) {
  let user = await User.findById(_id);
  let update = [];
  if (!user) return false;
  if (password) user.password = password;
  if (isBlock) user.isBlock = isBlock;
  if (role) user.role = role;
  //    Update User Info
  if (info) {
    if (user.info) update.push(UserInfo.updateUserInfo(user.info, info));
    else
      await UserInfo.addUserInfo(info).then(doc => {
        user.info = doc._id;
      });
  }
  update.push(user.update());
  let result = await Promise.all(update);
  return result;
}

module.exports = { model: User, addUser, updateUser, getUser };
