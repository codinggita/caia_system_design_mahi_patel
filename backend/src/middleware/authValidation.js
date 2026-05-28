

//auth validation 
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateUser = async (req, res, next) => {
  // Check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Authentication invalid. Missing or malformed token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    // Attach the user to the request
    req.user = { userId: payload.userId, name: payload.name, role: payload.role };
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Authentication invalid. Token verification failed.' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Unauthorized to access this route' });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };