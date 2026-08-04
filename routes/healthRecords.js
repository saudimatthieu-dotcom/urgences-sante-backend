require('../models/connection');
var express = require('express');
var router = express.Router();
const { checkBody } = require('../modules/checkBody');
const User = require('../models/users');
const HealthRecord = require('../models/healthRecords');

router.post('/', (req, res) => {
  if (!checkBody(req.body, ['token', 'label'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ token: req.body.token }).then((user) => {
    if (!user) {
      res.json({ result: false, error: 'User not found' });
      return;
    }

    const newHealthRecord = new HealthRecord({
      user: user._id,
      label: req.body.label,
      notes: req.body.notes,
      occurredAt: req.body.occurredAt,
      practitioner: req.body.practitioner,
      hospital: req.body.hospital,
    });

    newHealthRecord.save().then((healthRecord) => {
      res.json({ result: true, healthRecord });
    });
  });
});

router.get('/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then((user) => {
    if (!user) {
      res.json({ result: false, error: 'User not found' });
      return;
    }

    HealthRecord.find({ user: user._id }).then((healthRecords) => {
      res.json({ result: true, healthRecords });
    });
  });
});


module.exports = router;
