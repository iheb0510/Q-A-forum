const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  try {
    if (!req.user.isAdmin) {
      return res.status(401).json({ msg: 'unauthorized access' });
    }
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
