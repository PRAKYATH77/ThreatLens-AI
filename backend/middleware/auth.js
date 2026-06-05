const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const auth = (req, res, next) => {
  // Check for signed cookie first
  let token = req.signedCookies.token;

  // If no cookie, check Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7); // Remove 'Bearer ' prefix
    }
  }

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Authentication Invalid: No Token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, username: payload.username, role: payload.role };
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Authentication Invalid: Verify Failed' });
  }
};

module.exports = { auth };