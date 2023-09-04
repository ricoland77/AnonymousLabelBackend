const mongoose = require("mongoose");

const Session = mongoose.model("SessionStudio", {
  name: String,
  email: String,
  phone: {
    type: String,
    // match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
  },
  sms: Boolean,
  message: String,
  session: String,
  date: [String],
});

module.exports = Session;
