const mongoose = require("mongoose");

const Store = mongoose.model("Store", {
  email: String,
  firstname: String,
  name: String,
  phone: Number,
  company: String,
  selectedCountry: String,
  adress: String,
  postalCode: Number,
  city: String,
  regionSelect: String,
  total: Number,
  description: [
    {
      artist: String,
      name: String,
      quantity: Number,
    },
  ],
});

module.exports = Store;
