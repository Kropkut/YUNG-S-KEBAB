const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountName: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    enum: ['bank', 'card'],
    required: true
  },
  // Bank account specific fields
  bankName: String,
  accountNumber: {
    type: String,
    select: false // Don't return by default for security
  },
  routingNumber: {
    type: String,
    select: false
  },
  accountSubType: {
    type: String,
    enum: ['savings', 'checking', 'money-market'],
    default: 'savings'
  },
  // Card specific fields
  cardNumber: {
    type: String,
    select: false
  },
  cardType: {
    type: String,
    enum: ['debit', 'credit']
  },
  expiryDate: String,
  // Common fields
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  linkedGoals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BankAccount', bankAccountSchema);
