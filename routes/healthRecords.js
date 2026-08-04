var express = require('express');
var router = express.Router();

const HealthRecord = require('../models/healthRecords');



router.post('/', (req, res) => {
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


router.get('/', (req, res) => {
  FirstResponder.find({  })
    .then((firstResponders) => {
      res.json({ result: true, firstResponders });
    });
});


module.exports = router;
