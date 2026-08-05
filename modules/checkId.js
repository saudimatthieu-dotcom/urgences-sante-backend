const mongoose = require('mongoose');

const checkId = (param) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
    return res.status(400).json({ result: false, error: 'Invalid id' });
  }
  next();
};

module.exports = checkId;