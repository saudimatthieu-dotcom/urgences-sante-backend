require('../models/connection');
var express = require('express');
var router = express.Router();
const { checkBody } = require('../modules/checkBody');
const Alert = require('../models/alerts');
const User = require('../models/users');
const FirstResponder = require('../models/firstResponders');

router.post('/', (req, res) => {
  if (!checkBody(req.body, ['token', 'latitude', 'longitude'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ token: req.body.token })
    .then((user) => {
      if (!user) {
        res.json({ result: false, error: 'User not found' });
        return;
      }

      const newAlert = new Alert({
        requester: user._id,
        location: {
          latitude: req.body.latitude,
          longitude: req.body.longitude,
        },
      });

      newAlert.save().then((alert) => {
        res.json({ result: true, alert });
      });
    });
});

router.get('/:id', (req, res) => {
  Alert.findById(req.params.id)
    .then((alert) => {
      res.json(alert ? { result: true, alert } : { result: false, error: 'Alert not found' });
    });
});

router.put('/:alertId/accept', (req, res) => {
  if (!checkBody(req.body, ['token'])) {
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
        res.json({ result: false, error: 'Not a first responder' });
        return;
      }
      Alert.findById(req.params.alertId).then((alert) => {
        if (!alert) {
          res.json({ result: false, error: 'Alert not found' });
          return;
        }
        if (alert.status !== 'pending') {
          res.json({ result: false, error: 'Alert already accepted' });
          return;
        }

        const update = {
          status: 'accepted',
          firstResponder: responder._id,
          acceptedAt: new Date(),
        };

        Alert.updateOne({ _id: req.params.alertId }, update).then(() => {
          res.json({ result: true });
        });
      });
    });
  });
});


router.put('/:alertId/close', (req, res) => {
  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  Alert.findById(req.params.alertId).then((alert) => {
    if (!alert) {
      res.json({ result: false, error: 'Alert not found' });
      return;
    }
    if (alert.status === 'resolved' || alert.status === 'cancelled') {
      res.json({ result: false, error: 'Alert already closed' });
      return;
    }

    const update = {
      status: 'resolved',
      resolvedAt: new Date(),
    };

    Alert.updateOne({ _id: req.params.alertId }, update).then(() => {
      res.json({ result: true });
    });
  });
});

module.exports = router;