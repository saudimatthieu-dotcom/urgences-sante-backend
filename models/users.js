const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  country: String,
  city: String,
  postalCode: Number,
  street: String,
});

const UserSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true, required: true },
  socialSecurityNumber: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  token: String,
  phone: String,
  address: addressSchema,
  birthdate: Date,
  isFirstResponder: { type: Boolean, default: false },
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
