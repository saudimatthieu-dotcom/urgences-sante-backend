require("../models/connection");
var express = require("express");
var router = express.Router();

const Hospital = require("../models/hospitals");

router.get("/", (req, res) => {
  Hospital.find()
    .then((hospitalDocs) => {
      const hospitals = hospitalDocs.map((hospital) => ({
        id: hospital._id,
        name: hospital.name,
        latitude: hospital.location.latitude,
        longitude: hospital.location.longitude,
        specialties: hospital.specialties,
      }));
      res.json({ result: true, hospitals });
    })
    .catch((error) => {
      res.status(500).json({ result: false, error: error.message });
    });
});

module.exports = router;
