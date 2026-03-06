const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const jwt_token = process.env.jwtPrivateKey;
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, jwt_token);
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
module.exports.userSchema = userSchema;
