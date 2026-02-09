const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const { detectFraud } = require('../utils/fraudDetection');

exports.createTransaction = async (req, res) => {
  try {
    const { type, amount, toAccountNumber } = req.body;
    
    const account = await Account.findOne({ userId: req.user.id });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    if (account.status !== 'active') {
      return res.status(403).json({ error: 'Account not active' });
    }
    
    const fraudScore = await detectFraud(account.accountNumber, amount, type);
    
    let status = 'completed';
    if (fraudScore > 70) status = 'flagged';
    
    if (type === 'withdrawal' || type === 'transfer') {
      if (account.balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      account.balance -= amount;
      
      if (type === 'transfer' && status === 'completed') {
        const toAccount = await Account.findOne({ accountNumber: toAccountNumber });
        if (toAccount) {
          toAccount.balance += amount;
          await toAccount.save();
        }
      }
    } else if (type === 'deposit') {
      account.balance += amount;
    }
    
    await account.save();
    
    const transaction = await Transaction.create({
      accountNumber: account.accountNumber,
      type,
      amount,
      toAccountNumber,
      status,
      fraudScore
    });
    
    res.status(201).json({ transaction, newBalance: account.balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user.id });
    const transactions = await Transaction.find({ accountNumber: account.accountNumber }).sort({ timestamp: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ timestamp: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFlaggedTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: 'flagged' }).sort({ timestamp: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
