const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Sport = require('../models/Sport');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is main admin
const requireMainAdmin = (req, res, next) => {
  if (req.user.role !== 'main_admin') {
    return res.status(403).json({ message: 'Main admin access required' });
  }
  next();
};

// Middleware to check if user is admin (main or sport)
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'main_admin' && req.user.role !== 'sport_admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Middleware to check if user can manage a specific sport
const canManageSport = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (req.user.role === 'main_admin') {
      return next();
    }

    if (req.user.role === 'sport_admin') {
      const sport = await Sport.findById(id);
      if (!sport) {
        return res.status(404).json({ message: 'Sport not found' });
      }

      if (req.user.canManageSport(id, sport.name)) {
        return next();
      }
    }

    return res.status(403).json({ message: 'Access denied for this sport' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if user can manage sport by name
const canManageSportByName = async (req, res, next) => {
  try {
    const { sportName } = req.params;
    
    if (req.user.role === 'main_admin') {
      return next();
    }

    if (req.user.role === 'sport_admin') {
      if (req.user.sportNames && req.user.sportNames.includes(sportName)) {
        return next();
      }
    }

    return res.status(403).json({ message: 'Access denied for this sport' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  authenticateToken,
  requireMainAdmin,
  requireAdmin,
  canManageSport,
  canManageSportByName
}; 