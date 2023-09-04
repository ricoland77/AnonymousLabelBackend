const mongoose = require("mongoose");

const Newsletter = mongoose.model("Newsletter", {
  email: String,
});

module.exports = Newsletter;
