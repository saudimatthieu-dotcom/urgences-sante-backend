var express = require("express");
var router = express.Router();

const User = require("../models/users");
const HealthRecord = require("../models/healthRecords");
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");

router.post("/signup", function (req, res) {
  if (!checkBody(req.body, ["email", "password"])) {
    res.status(400).json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ email: req.body.email })
    .then((existingUser) => {
      if (existingUser) {
        res.status(400).json({ result: false, error: "User already exists" });
        return;
      }

      return bcrypt.hash(req.body.password, 10).then((hash) => {
        const newUser = new User({
          email: req.body.email,
          socialSecurityNumber: req.body.socialSecurityNumber,
          password: hash,
          token: uid2(32),
        });

        return newUser.save().then((savedUser) => {
          res.status(201).json({
            result: true,
            token: savedUser.token,
            email: savedUser.email,
          });
        });
      });
    })
    .catch((error) => {
      res.status(500).json({ result: false, error: error.message });
    });
});

router.put('/profile', (req, res) => {
  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'Missing or empty fields'});
    return;
  }
  User.findOne({ token: req.body.token })
    .then((user) => {
      if (!user) {
        res.json({ result: false, error: 'User not found' });
        return;
      }

      const update = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        birthdate: req.body.birthdate,
        address: req.body.address,
        socialSecurityNumber: req.body.socialSecurityNumber,
      };

      return User.updateOne({ _id: user._id }, update).then(() => {
        res.json({ result: true });
      });
    })
    .catch((error) => {
      res.status(500).json({ result: false, error: error.message });
    });
});




router.get('/profile/:token', (req, res) => {
  User.findOne({ token: req.params.token })
    .then((user) => {
      if (!user) {
        res.json({ result: false, error: 'User not found' });
        return;
      }

      return HealthRecord.find({ user: user._id }).then((healthRecords) => {
        res.json({ result: true, healthRecords });
      });
    })
    .catch((error) => {
      res.status(500).json({ result: false, error: error.message });
    });
});

module.exports = router;
