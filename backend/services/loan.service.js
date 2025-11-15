const LoanApplication = require('../models/LoanApplication.model');
const Customer = require('../models/Customer.model');

// Normalize values to 0-1 scale
const normalize = (value, min, max) => {
  if (max === min) return 0;
  return (value - min) / (max - min);
};

// Evaluate loan eligibility
const evaluateLoan = async (applicationId) => {
  try {
    // Fetch application with customer data
    const application = await LoanApplication.findById(applicationId)
      .populate({
        path: 'customerId',
        model: 'Customer'
      });

    if (!application) {
      throw new Error('Loan application not found');
    }

    const customer = application.customerId;
    
    // Define normalization ranges
    const MIN_INCOME = 0;
    const MAX_INCOME = 10000000; // 1 crore
    const MIN_CREDIT_SCORE = 300;
    const MAX_CREDIT_SCORE = 850;
    const MIN_AMOUNT = 1000;
    const MAX_AMOUNT = 10000000;

    // Normalize values
    const incomeNorm = normalize(customer.income, MIN_INCOME, MAX_INCOME);
    const creditScoreNorm = normalize(customer.creditScore, MIN_CREDIT_SCORE, MAX_CREDIT_SCORE);
    const amountNorm = normalize(application.amountRequested, MIN_AMOUNT, MAX_AMOUNT);

    // Calculate eligibility score
    // Higher credit score and income are good, lower loan amount (relative to capacity) is good
    const eligibilityScore = (0.6 * creditScoreNorm) + (0.4 * incomeNorm) - (0.2 * amountNorm);
    
    // Normalize to 0-1 range
    const normalizedScore = Math.max(0, Math.min(1, eligibilityScore));

    // Determine approval threshold
    const APPROVAL_THRESHOLD = 0.5;

    // Update application
    let status = 'PENDING';
    let rejectionReason = null;

    if (normalizedScore >= APPROVAL_THRESHOLD) {
      status = 'APPROVED';
      // Set interest rate based on score (better score = lower rate)
      application.interestRate = 12 - (normalizedScore * 5); // 7-12% range
    } else {
      status = 'REJECTED';
      rejectionReason = determineRejectionReason(
        customer.creditScore, 
        customer.income, 
        application.amountRequested
      );
    }

    application.eligibilityScore = normalizedScore;
    application.status = status;
    application.rejectionReason = rejectionReason;

    await application.save();

    return {
      success: true,
      eligibilityScore: normalizedScore,
      status,
      rejectionReason
    };

  } catch (error) {
    console.error('Evaluate loan error:', error);
    throw error;
  }
};

// Determine specific rejection reason
const determineRejectionReason = (creditScore, income, amount) => {
  const reasons = [];

  if (creditScore < 550) {
    reasons.push('Credit score below minimum threshold (550)');
  }

  if (income < 200000) {
    reasons.push('Annual income below minimum requirement (₹2,00,000)');
  }

  const debtToIncomeRatio = (amount / 12) / (income / 12);
  if (debtToIncomeRatio > 0.5) {
    reasons.push('Loan amount too high relative to income (EMI > 50% of monthly income)');
  }

  if (reasons.length === 0) {
    reasons.push('Overall eligibility score below approval threshold');
  }

  return reasons.join('; ');
};

// Calculate EMI
const calculateEMI = (principal, ratePercent, tenureMonths) => {
  const monthlyRate = ratePercent / 12 / 100;
  if (monthlyRate === 0) return principal / tenureMonths;
  
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
               (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  
  return Math.round(emi * 100) / 100;
};

module.exports = {
  evaluateLoan,
  calculateEMI
};
