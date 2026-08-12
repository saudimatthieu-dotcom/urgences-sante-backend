const mongoose = require("mongoose");

const practitionerSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  speciality: String,
  phone: String,
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "hospitals" },
});

const Practitioner = mongoose.model("practitioners", practitionerSchema);

module.exports = Practitioner;
