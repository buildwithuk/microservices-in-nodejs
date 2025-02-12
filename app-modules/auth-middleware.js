const { API_URL, PORT, ERROR_MESSAGES, STATUS_CODES, JWT_SECRET } = require('./constants');
const jwt = require('jsonwebtoken');


// Authentication middleware
const authMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers['authorization'];

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = {id: decoded.id, username: decoded.username};

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;