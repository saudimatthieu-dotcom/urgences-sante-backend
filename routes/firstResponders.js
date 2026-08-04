require('../models/connection');
var express = require('express');
var router = express.Router();
const { checkBody } = require('../modules/checkBody');
const User = require('../models/users');
const FirstResponder = require('../models/firstResponders');

router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ token: req.body.token }).then((user) => {
    if (!user) {
      res.json({ result: false, error: 'User not found' });
      return;
    }

    // Check if the user has not already been registered as a first responder
    FirstResponder.findOne({ user: user._id }).then((responder) => {
      if (responder) {
        res.json({ result: false, error: 'First responder already exists' });
        return;
      }

      const newFirstResponder = new FirstResponder({
        user: user._id,
        certifications: req.body.certifications,
        isPubliclyListed: req.body.isPubliclyListed,
      });

      newFirstResponder.save().then((firstResponder) => {
        res.json({ result: true, firstResponder });
      });
    });
  });
});

router.put('/availability', (req, res) => {
  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  if (typeof req.body.isAvailable !== 'boolean') {
    res.json({ result: false, error: 'isAvailable must be a boolean' });
    return;
  }

  User.findOne({ token: req.body.token }).then((user) => {
    if (!user) {
      res.json({ result: false, error: 'User not found' });
      return;
    }
    FirstResponder.findOne({ user: user._id }).then((responder) => {
      if (!responder) {
        res.json({ result: false, error: 'First responder not found' });
        return;
      }

      const update = {
        isAvailable: req.body.isAvailable,
      };

      FirstResponder.updateOne({ user: user._id }, update).then(() => {
        res.json({ result: true });
      });
    });
  });
});

router.put('/location', (req, res) => {
  if (!checkBody(req.body, ['token', 'latitude', 'longitude'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ token: req.body.token }).then((user) => {
    if (!user) {
      res.json({ result: false, error: 'User not found' });
      return;
    }
    FirstResponder.findOne({ user: user._id }).then((responder) => {
      if (!responder) {
        res.json({ result: false, error: 'First responder not found' });
        return;
      }

      const update = {
        location: {
          latitude: req.body.latitude,
          longitude: req.body.longitude,
        },
      };

      FirstResponder.updateOne({ user: user._id }, update).then(() => {
        res.json({ result: true });
      });
    });
  });
});

router.get('/', (req, res) => {
  FirstResponder.find({ isAvailable: true, isPubliclyListed: true })
    .populate('user')
    .then((responders) => {
      const firstResponders = responders
        .filter((responder) => responder.user && responder.location)
        .map((responder) => ({
          id: responder._id,
          name: `${responder.user.firstname} ${responder.user.lastname.charAt(0)}.`,
          certification: responder.certifications[0]?.certName,
          phone: responder.user.phone,
          latitude: responder.location.latitude,
          longitude: responder.location.longitude,
        }));

      res.json({ result: true, firstResponders });
    });
});

module.exports = router;
