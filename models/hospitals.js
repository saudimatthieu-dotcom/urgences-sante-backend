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
  name: { type: String, required: true },
  address: addressSchema,
  phone: String,
  specialties: { type: [String], required: true },
  location: { type: locationSchema, required: true },
});

const Hospital = mongoose.model("hospitals", hospitalSchema);

module.exports = Hospital;
