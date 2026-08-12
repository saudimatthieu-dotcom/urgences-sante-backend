var express = require("express");
var router = express.Router();


const User = require("../models/users");
const FirstResponder = require("../models/firstResponders");
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");

const uniqid = require('uniqid');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

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
          const userData = {
            result: true,
            token: savedUser.token,
            email: savedUser.email,
            socialSecurityNumber: savedUser.socialSecurityNumber,
            isFirstResponder: savedUser.isFirstResponder,
          };

          if (!savedUser.isFirstResponder) {
            res.status(201).json(userData);
            return;
          }

          const newFirstResponder = new FirstResponder({
            user: savedUser._id,
          });

          return newFirstResponder.save().then(() => {
            res.status(201).json(userData);
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
          .json({
            result: true,
            token: user.token,
            email: user.email,
            socialSecurityNumber: user.socialSecurityNumber,
            isFirstResponder: user.isFirstResponder,
          });
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

router.put("/profile", (req, res) => {
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ token: req.body.token })
    .then((user) => {
      if (!user) {
        res.json({ result: false, error: "User not found" });
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

router.get("/profile/:token", (req, res) => {
  User.findOne({ token: req.params.token })
    .then((user) => {
      if (!user) {
        res.json({ result: false, error: "User not found" });
        return;
      }

      res.json({
        result: true,
        profile: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          birthdate: user.birthdate,
          address: user.address,
          socialSecurityNumber: user.socialSecurityNumber,
          photo: user.photo,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ result: false, error: error.message });
    });
});

//Cloudinary route profile photo
router.post('/profile/upload', async (req, res) => {
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);

  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    await User.updateOne(
      { token: req.body.token },
      { photo: resultCloudinary.secure_url },
    );
    fs.unlinkSync(photoPath);
    res.json({ result: true, url: resultCloudinary.secure_url });
  } else {
    res.json({ result: false, error: resultMove });
  }
});


module.exports = router;
