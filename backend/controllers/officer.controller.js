const LoanApplication = require('../models/LoanApplication.model');
const LoanOfficer = require('../models/LoanOfficer.model');
const { evaluateLoan } = require('../services/loan.service');

// @desc    Get all pending loan applications
// @route   GET /api/officer/loans/pending
// @access  Private (Officer only)
const getPendingLoans = async (req, res) => {
  try {
    const loans = await LoanApplication.find({ status: 'PENDING' })
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.json({
      count: loans.length,
      loans
    });

  } catch (error) {
    console.error('Get pending loans error:', error);
    res.status(500).json({ 
      message: 'Error fetching pending loans', 
      error: error.message 
    });
  }
};

// @desc    Review loan application (Approve/Reject)
// @route   POST /api/officer/loans/:id/review
// @access  Private (Officer only)
const reviewLoan = async (req, res) => {
  try {
    const loanId = req.params.id;
    const { action, comments } = req.body;

    // Validation
    if (!action || !['APPROVE', 'REJECT'].includes(action)) {
      return res.status(400).json({ 
        message: 'Action must be either APPROVE or REJECT' 
      });
    }

    // Find loan application
    const loan = await LoanApplication.findById(loanId)
      .populate('customerId');

    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    // Get officer details
    const officer = await LoanOfficer.findOne({ userId: req.user.userId });
    if (!officer) {
      return res.status(404).json({ message: 'Officer profile not found' });
    }

    // Update loan application
    if (action === 'APPROVE') {
      loan.status = 'APPROVED';
      loan.officerId = officer._id;
      if (comments) {
        loan.rejectionReason = null; // Clear any previous rejection reason
      }
    } else if (action === 'REJECT') {
      loan.status = 'REJECTED';
      loan.officerId = officer._id;
      if (comments) {
        loan.rejectionReason = comments;
      } else {
        loan.rejectionReason = 'Rejected by loan officer';
      }
    }

    await loan.save();

    // Populate the updated loan
    const updatedLoan = await LoanApplication.findById(loanId)
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate({
        path: 'officerId',
        populate: { path: 'userId', select: 'name email' }
      });

    res.json({
      message: `Loan application ${action.toLowerCase()}d successfully`,
      loan: updatedLoan
    });

  } catch (error) {
    console.error('Review loan error:', error);
    res.status(500).json({ 
      message: 'Error reviewing loan application', 
      error: error.message 
    });
  }
};

// @desc    Get all loans reviewed by the officer
// @route   GET /api/officer/loans/my-reviews
// @access  Private (Officer only)
const getMyReviews = async (req, res) => {
  try {
    // Get officer details
    const officer = await LoanOfficer.findOne({ userId: req.user.userId });
    if (!officer) {
      return res.status(404).json({ message: 'Officer profile not found' });
    }

    const loans = await LoanApplication.find({ officerId: officer._id })
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ updatedAt: -1 });

    res.json({
      count: loans.length,
      loans
    });

  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({ 
      message: 'Error fetching reviewed loans', 
      error: error.message 
    });
  }
};

// @desc    Get loan statistics
// @route   GET /api/officer/stats
// @access  Private (Officer only)
const getLoanStats = async (req, res) => {
  try {
    const totalLoans = await LoanApplication.countDocuments();
    const pendingLoans = await LoanApplication.countDocuments({ status: 'PENDING' });
    const approvedLoans = await LoanApplication.countDocuments({ status: 'APPROVED' });
    const rejectedLoans = await LoanApplication.countDocuments({ status: 'REJECTED' });

    // Calculate total amount
    const approvedAmount = await LoanApplication.aggregate([
      { $match: { status: 'APPROVED' } },
      { $group: { _id: null, total: { $sum: '$amountRequested' } } }
    ]);

    res.json({
      totalLoans,
      pendingLoans,
      approvedLoans,
      rejectedLoans,
      totalApprovedAmount: approvedAmount[0]?.total || 0
    });

  } catch (error) {
    console.error('Get loan stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching loan statistics', 
      error: error.message 
    });
  }
};

module.exports = {
  getPendingLoans,
  reviewLoan,
  getMyReviews,
  getLoanStats
};
