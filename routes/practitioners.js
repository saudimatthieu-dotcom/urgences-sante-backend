require("../models/connection");
var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Practitioner = require("../models/practitioners");

router.get("/", (req, res) => {
  Practitioner.find()
    .then((practitionerDocs) => {
      const practitioners = practitionerDocs.map((practitioner) => ({
        id: practitioner._id,
        firstname: practitioner.firstname,
        lastname: practitioner.lastname,
        speciality: practitioner.speciality,
        phone: practitioner.phone,
        hospital: practitioner.hospital,
      }));
      res.json({ result: true, practitioners });
    })
    .catch((error) => {
      res.status(500).json({ result: false, error: error.message });
    });
});

router.get("/:id", (req, res) => {
  Practitioner.findById(req.params.id)
    .then((practitioner) => {
      if (!practitioner) {
        res
          .status(404)
          .json({ result: false, error: "Practitioner not found" });
        return;
      }
      res.json({
        result: true,
        practitioner: {
          id: practitioner._id,
          firstname: practitioner.firstname,
          lastname: practitioner.lastname,
          speciality: practitioner.speciality,
          phone: practitioner.phone,
          hospital: practitioner.hospital,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ result: false, error: error.message });
    });
});

router.post("/", (req, res) => {
  if (!checkBody(req.body, ["lastname", "speciality", "hospital"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const newPractitioner = new Practitioner({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    speciality: req.body.speciality,
    phone: req.body.phone,
    hospital: req.body.hospital,
  });

  newPractitioner
    .save()
    .then((practitioner) => {
      res.json({ result: true, practitioner });
    })
    .catch((error) => {
      res.status(500).json({ result: false, error: error.message });
    });
});

router.put("/:id", (req, res) => {
  const update = {};
  for (const field of [
    "firstname",
    "lastname",
    "speciality",
    "phone",
    "hospital",
  ]) {
    if (req.body[field] !== undefined) {
      update[field] = req.body[field];
    }
  }

  Practitioner.findByIdAndUpdate(req.params.id, update, { new: true })
    .then((practitioner) => {
      if (!practitioner) {
        res
          .status(404)
          .json({ result: false, error: "Practitioner not found" });
        return;
      }
      res.json({ result: true, practitioner });
    })
    .catch((error) => {
      res.status(500).json({ result: false, error: error.message });
    });
});

router.delete("/:id", (req, res) => {
  Practitioner.findByIdAndDelete(req.params.id)
    .then((practitioner) => {
      if (!practitioner) {
        res
          .status(404)
          .json({ result: false, error: "Practitioner not found" });
        return;
      }
      res.json({ result: true });
    })
    .catch((error) => {
      res.status(500).json({ result: false, error: error.message });
    });
});

module.exports = router;
