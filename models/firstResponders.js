const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  latitude: Number,
  longitude: Number,
});

const certificationSchema = mongoose.Schema({
  certName: String,
  organisation: String,
});

const firstResponderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    unique: true,
    required: true,
  },
  certifications: [certificationSchema],
  isAvailable: { type: Boolean, default: false },
  isPubliclyListed: { type: Boolean, default: false },
  location: locationSchema,
});

const FirstResponder = mongoose.model("firstResponders", firstResponderSchema);

module.exports = FirstResponder;
