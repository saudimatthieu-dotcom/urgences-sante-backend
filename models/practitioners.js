const mongoose = require("mongoose");

const practitionerSchema = mongoose.Schema({
  firstname: String,
  lastname: { type: String, required: true },
  speciality: { type: String, required: true },
  phone: String,
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "hospitals", required: true },
});

const Practitioner = mongoose.model("practitioners", practitionerSchema);

module.exports = Practitioner;
