const Customer = require('../models/Customer.model');
const User = require('../models/User.model');

// @desc    Get customer profile
// @route   GET /api/customer/profile
// @access  Private (Customer only)
const getProfile = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user.userId })
      .populate('userId', '-passwordHash');

    if (!customer) {
      return res.status(404).json({ message: 'Customer profile not found' });
    }

    res.json(customer);

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Error fetching customer profile', 
      error: error.message 
    });
  }
};

// @desc    Update customer profile
// @route   PUT /api/customer/profile
// @access  Private (Customer only)
const updateProfile = async (req, res) => {
  try {
    const { income, creditScore } = req.body;

    const customer = await Customer.findOne({ userId: req.user.userId });

    if (!customer) {
      return res.status(404).json({ message: 'Customer profile not found' });
    }

    // Update fields
    if (income !== undefined) {
      customer.income = income;
    }
    if (creditScore !== undefined) {
      if (creditScore < 300 || creditScore > 850) {
        return res.status(400).json({ 
          message: 'Credit score must be between 300 and 850' 
        });
      }
      customer.creditScore = creditScore;
    }

    await customer.save();

    const updatedCustomer = await Customer.findById(customer._id)
      .populate('userId', '-passwordHash');

    res.json({
      message: 'Profile updated successfully',
      customer: updatedCustomer
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Error updating customer profile', 
      error: error.message 
    });
  }
};

// @desc    Get customer by ID
// @route   GET /api/customer/:id
// @access  Private
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('userId', '-passwordHash');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);

  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ 
      message: 'Error fetching customer', 
      error: error.message 
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getCustomerById
};
