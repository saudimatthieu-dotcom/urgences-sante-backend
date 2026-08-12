const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  country: String,
  city: String,
  postalCode: Number,
  street: String,
});

const locationSchema = mongoose.Schema({
  latitude: Number,
  longitude: Number,
});

const hospitalSchema = mongoose.Schema({
  name: String,
  address: addressSchema,
  phone: String,
  services: [String],
  location: locationSchema,
});

const Hospital = mongoose.model("hospitals", hospitalSchema);

module.exports = Hospital;
