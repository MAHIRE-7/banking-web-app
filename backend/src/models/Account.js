const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  accountNumber: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  accountType: { type: String, enum: ['savings', 'checking'], default: 'savings' },
  status: { type: String, enum: ['active', 'frozen', 'closed'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Account', accountSchema);
