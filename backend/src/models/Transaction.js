const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'transfer'], required: true },
  amount: { type: Number, required: true },
  toAccountNumber: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'flagged'], default: 'pending' },
  fraudScore: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
