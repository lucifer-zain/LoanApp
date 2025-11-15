const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  income: { 
    type: Number,
    default: 0
  },
  creditScore: { 
    type: Number,
    min: 300,
    max: 850,
    default: 300
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
