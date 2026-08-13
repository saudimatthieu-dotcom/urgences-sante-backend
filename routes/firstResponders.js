require("../models/connection");
var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const User = require("../models/users");
const FirstResponder = require("../models/firstResponders");

router.put("/availability", (req, res) => {
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  if (typeof req.body.isAvailable !== "boolean") {
    res.json({ result: false, error: "isAvailable must be a boolean" });
    return;
  }

  User.findOne({ token: req.body.token })
    .then((user) => {
      if (!user) {
        res.json({ result: false, error: "User not found" });
        return;
      }
      return FirstResponder.findOne({ user: user._id }).then((responder) => {
        if (!responder) {
          res.json({ result: false, error: "First responder not found" });
          return;
        }

        const update = {
          isAvailable: req.body.isAvailable,
        };

        return FirstResponder.updateOne({ user: user._id }, update).then(() => {
          res.json({ result: true });
        });
      });
    })
    .catch((error) => {
      res.status(500).json({ result: false, error: error.message });
    });
});

router.put("/location", (req, res) => {
  if (!checkBody(req.body, ["token", "latitude", "longitude"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ token: req.body.token })
    .then((user) => {
      if (!user) {
        res.json({ result: false, error: "User not found" });
        return;
      }
      return FirstResponder.findOne({ user: user._id }).then((responder) => {
        if (!responder) {
          res.json({ result: false, error: "First responder not found" });
          return;
        }

        const update = {
          location: {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
          },
        };

        return FirstResponder.updateOne({ user: user._id }, update).then(() => {
          res.json({ result: true });
        });
      });
    })
    .catch((error) => {
      res.status(500).json({ result: false, error: error.message });
    });
});

//my own responder profile
router.get("/me/:token", (req, res) => {
  User.findOne({ token: req.params.token })
    .then((user) => {
      if (!user) {
        res.json({ result: false, error: "User not found" });
        return;
      }
      return FirstResponder.findOne({ user: user._id }).then((responder) => {
        if (!responder) {
          res.json({ result: false, error: "First responder not found" });
          return;
        }

        res.json({
          result: true,
          firstResponder: {
            id: responder._id,
            certifications: responder.certifications,
            isAvailable: responder.isAvailable,
            location: responder.location,
          },
        });
      });
    })
    .catch((error) => {
      res.status(500).json({ result: false, error: error.message });
    });
});

router.get("/", (req, res) => {
  FirstResponder.find({ isAvailable: true })
    .populate("user")
    .then((responders) => {
      const firstResponders = responders
        .filter((responder) => responder.user && responder.location)
        .map((responder) => ({
          id: responder._id,
          name: `${responder.user.firstname || ""} ${responder.user.lastname ? `${responder.user.lastname.charAt(0)}.` : ""}`.trim(),
          certification: responder.certifications[0]?.certName,
          phone: responder.user.phone,
          photo: responder.user.photo,
          latitude: responder.location.latitude,
          longitude: responder.location.longitude,
        }));

      res.json({ result: true, firstResponders });
    })
    .catch((error) => {
      res.status(500).json({ result: false, error: error.message });
    });
});

module.exports = router;
