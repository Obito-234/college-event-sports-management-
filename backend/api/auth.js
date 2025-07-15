const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken, requireMainAdmin } = require('../middleware/auth');

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return data and token
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      assignedSports: user.assignedSports,
      sportNames: user.sportNames,
      isActive: user.isActive,
      lastLogin: user.lastLogin
    };

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/register
// @desc    Register new user (main admin only)
// @access  Private (main admin)
router.post('/register', authenticateToken, requireMainAdmin, async (req, res) => {
  try {
    const { username, email, password, role, assignedSports, sportNames } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: role || 'sport_admin',
      assignedSports: assignedSports || [],
      sportNames: sportNames || []
    });

    await user.save();

    // Return user data 
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      assignedSports: user.assignedSports,
      sportNames: user.sportNames,
      isActive: user.isActive
    };

    res.status(201).json({
      message: 'User created successfully',
      user: userData
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userData = {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      assignedSports: req.user.assignedSports,
      sportNames: req.user.sportNames,
      isActive: req.user.isActive,
      lastLogin: req.user.lastLogin
    };

    res.json({ user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/users
// @desc    Get all users (main admin only)
// @access  Private (main admin)
router.get('/users', authenticateToken, requireMainAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/users/:id
// @desc    Update user (main admin only)
// @access  Private (main admin)
router.put('/users/:id', authenticateToken, requireMainAdmin, async (req, res) => {
  try {
    const { username, email, role, assignedSports, sportNames, isActive } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (assignedSports !== undefined) user.assignedSports = assignedSports;
    if (sportNames !== undefined) user.sportNames = sportNames;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      assignedSports: user.assignedSports,
      sportNames: user.sportNames,
      isActive: user.isActive
    };

    res.json({
      message: 'User updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/auth/users/:id
// @desc    Delete user (main admin only)
// @access  Private (main admin)
router.delete('/users/:id', authenticateToken, requireMainAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 