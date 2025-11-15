const LoanApplication = require('../models/LoanApplication.model');
const Customer = require('../models/Customer.model');
const { evaluateLoan, calculateEMI } = require('../services/loan.service');

// @desc    Apply for a loan
// @route   POST /api/loans/apply
// @access  Private (Customer only)
const applyForLoan = async (req, res) => {
  try {
    const { customerId, amountRequested, tenureMonths } = req.body;

    // Validation
    if (!customerId || !amountRequested || !tenureMonths) {
      return res.status(400).json({ 
        message: 'Please provide customerId, amountRequested, and tenureMonths' 
      });
    }

    // Verify customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Verify the customer belongs to the requesting user
    if (customer.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Create loan application
    const loanApplication = await LoanApplication.create({
      customerId,
      amountRequested,
      tenureMonths,
      status: 'PENDING'
    });

    // Evaluate loan automatically
    const evaluation = await evaluateLoan(loanApplication._id);

    // Fetch updated application
    const updatedApplication = await LoanApplication.findById(loanApplication._id)
      .populate('customerId');

    // Calculate EMI
    const emi = calculateEMI(
      amountRequested, 
      updatedApplication.interestRate || 10, 
      tenureMonths
    );

    res.status(201).json({
      message: 'Loan application submitted successfully',
      loanId: loanApplication._id,
      status: updatedApplication.status,
      eligibilityScore: updatedApplication.eligibilityScore,
      interestRate: updatedApplication.interestRate,
      emi,
      rejectionReason: updatedApplication.rejectionReason
    });

  } catch (error) {
    console.error('Apply loan error:', error);
    res.status(500).json({ 
      message: 'Error submitting loan application', 
      error: error.message 
    });
  }
};

// @desc    Get loan application status
// @route   GET /api/loans/:id/status
// @access  Private
const getLoanStatus = async (req, res) => {
  try {
    const loanId = req.params.id;

    const loan = await LoanApplication.findById(loanId)
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate({
        path: 'officerId',
        populate: { path: 'userId', select: 'name email' }
      });

    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    // Calculate EMI
    const emi = calculateEMI(
      loan.amountRequested, 
      loan.interestRate || 10, 
      loan.tenureMonths
    );

    res.json({
      loanId: loan._id,
      status: loan.status,
      eligibilityScore: loan.eligibilityScore,
      amountRequested: loan.amountRequested,
      tenureMonths: loan.tenureMonths,
      interestRate: loan.interestRate,
      emi,
      rejectionReason: loan.rejectionReason,
      customer: loan.customerId,
      officer: loan.officerId,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt
    });

  } catch (error) {
    console.error('Get loan status error:', error);
    res.status(500).json({ 
      message: 'Error fetching loan status', 
      error: error.message 
    });
  }
};

// @desc    Get all loans for a customer
// @route   GET /api/loans/customer/:customerId
// @access  Private
const getCustomerLoans = async (req, res) => {
  try {
    const { customerId } = req.params;

    const loans = await LoanApplication.find({ customerId })
      .populate({
        path: 'officerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    // Add EMI calculation to each loan
    const loansWithEMI = loans.map(loan => ({
      ...loan.toObject(),
      emi: calculateEMI(loan.amountRequested, loan.interestRate || 10, loan.tenureMonths)
    }));

    res.json({
      count: loans.length,
      loans: loansWithEMI
    });

  } catch (error) {
    console.error('Get customer loans error:', error);
    res.status(500).json({ 
      message: 'Error fetching customer loans', 
      error: error.message 
    });
  }
};

// @desc    Get all loan applications
// @route   GET /api/loans
// @access  Private (Officer only)
const getAllLoans = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = {};
    if (status) {
      filter.status = status.toUpperCase();
    }

    const loans = await LoanApplication.find(filter)
      .populate({
        path: 'customerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate({
        path: 'officerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.json({
      count: loans.length,
      loans
    });

  } catch (error) {
    console.error('Get all loans error:', error);
    res.status(500).json({ 
      message: 'Error fetching loans', 
      error: error.message 
    });
  }
};

module.exports = {
  applyForLoan,
  getLoanStatus,
  getCustomerLoans,
  getAllLoans
};
