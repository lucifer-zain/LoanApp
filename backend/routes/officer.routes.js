const express = require('express');
const router = express.Router();
const { 
  getPendingLoans, 
  reviewLoan, 
  getMyReviews,
  getLoanStats 
} = require('../controllers/officer.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication and officer role
router.use(authMiddleware);
router.use(roleMiddleware('OFFICER'));

router.get('/loans/pending', getPendingLoans);
router.post('/loans/:id/review', reviewLoan);
router.get('/loans/my-reviews', getMyReviews);
router.get('/stats', getLoanStats);

module.exports = router;
