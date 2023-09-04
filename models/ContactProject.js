const mongoose = require("mongoose");

const ContactProject = mongoose.model("ContactProject", {
  name: String,
  email: String,
  subject: String,
  message: String,
});

module.exports = ContactProject;
