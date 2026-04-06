const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization || req.headers.Authorization || '';

    if (!authHeader) {
      return res.status(401).json({
        message: 'No token provided',
      });
    }

    if (!String(authHeader).startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Invalid token format',
      });
    }

    const token = String(authHeader).split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Token missing',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role || 'passenger',
      email: decoded.email || '',
    };

    next();
  } catch (error) {
    console.log('AUTH ERROR:', error.message);
    return res.status(401).json({
      message: 'Invalid token',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;