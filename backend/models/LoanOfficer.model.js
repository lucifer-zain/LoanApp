const mongoose = require('mongoose');

const loanOfficerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  branch: { 
    type: String,
    default: 'Main Branch'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LoanOfficer', loanOfficerSchema);
