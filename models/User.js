const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    unique: true,
    required: true,
    type: String,
  },
  account: {
    username: {
      unique: true,
      required: true,
      type: String,
    },
    avatar: Object,
  },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
