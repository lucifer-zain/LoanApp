const express = require('express');
const router = express.Router();
const { 
  applyForLoan, 
  getLoanStatus, 
  getCustomerLoans,
  getAllLoans 
} = require('../controllers/loan.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Loan application routes
router.post('/apply', roleMiddleware('CUSTOMER'), applyForLoan);
router.get('/:id/status', getLoanStatus);
router.get('/customer/:customerId', getCustomerLoans);
router.get('/', roleMiddleware('OFFICER'), getAllLoans);

module.exports = router;
