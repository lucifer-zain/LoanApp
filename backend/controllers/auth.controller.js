const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Customer = require('../models/Customer.model');
const LoanOfficer = require('../models/LoanOfficer.model');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      role: user.role,
      email: user.email 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, income, creditScore, branch } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        message: 'Please provide name, email, password, and role' 
      });
    }

    if (!['CUSTOMER', 'OFFICER'].includes(role)) {
      return res.status(400).json({ 
        message: 'Role must be either CUSTOMER or OFFICER' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      role
    });

    // Create role-specific document
    if (role === 'CUSTOMER') {
      await Customer.create({
        userId: user._id,
        income: income || 0,
        creditScore: creditScore || 300
      });
    } else if (role === 'OFFICER') {
      await LoanOfficer.create({
        userId: user._id,
        branch: branch || 'Main Branch'
      });
    }

    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id,
      role: user.role
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get role-specific ID
    let roleSpecificId = null;
    if (user.role === 'CUSTOMER') {
      const customer = await Customer.findOne({ userId: user._id });
      roleSpecificId = customer ? customer._id : null;
    } else if (user.role === 'OFFICER') {
      const officer = await LoanOfficer.findOne({ userId: user._id });
      roleSpecificId = officer ? officer._id : null;
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      token,
      userId: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      roleSpecificId
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in', 
      error: error.message 
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profile = { user };

    // Get role-specific data
    if (user.role === 'CUSTOMER') {
      const customer = await Customer.findOne({ userId: user._id });
      profile.customerDetails = customer;
    } else if (user.role === 'OFFICER') {
      const officer = await LoanOfficer.findOne({ userId: user._id });
      profile.officerDetails = officer;
    }

    res.json(profile);

  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ 
      message: 'Error fetching user profile', 
      error: error.message 
    });
  }
};

module.exports = { register, login, getMe };
