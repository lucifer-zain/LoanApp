const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  getCustomerById 
} = require('../controllers/customer.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/profile', roleMiddleware('CUSTOMER'), getProfile);
router.put('/profile', roleMiddleware('CUSTOMER'), updateProfile);
router.get('/:id', getCustomerById);

module.exports = router;
