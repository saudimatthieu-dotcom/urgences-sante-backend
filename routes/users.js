var express = require("express");
var router = express.Router();

const User = require("../models/users");
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
          isFirstResponder: req.body.isFirstResponder,
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

router.post("/signin", function (req, res) {
  if (!checkBody(req.body, ["email", "password"])) {
    res.status(400).json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        res
          .status(200)
          .json({ result: true, token: user.token, email: user.email });
      } else {
        res
          .status(401)
          .json({ result: false, error: "User not found or wrong password" });
      }
    })
    .catch((error) => {
      res.status(500).json({ result: false, error: error.message });
    });
});

module.exports = router;
