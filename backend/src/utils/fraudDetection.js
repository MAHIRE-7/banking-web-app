const Transaction = require('../models/Transaction');

const detectFraud = async (accountNumber, amount, type) => {
  let fraudScore = 0;
  
  if (amount > 10000) fraudScore += 30;
  if (amount > 50000) fraudScore += 50;
  
  const recentTransactions = await Transaction.find({
    accountNumber,
    timestamp: { $gte: new Date(Date.now() - 3600000) }
  });
  
  if (recentTransactions.length > 5) fraudScore += 40;
  
  const totalRecent = recentTransactions.reduce((sum, t) => sum + t.amount, 0);
  if (totalRecent > 20000) fraudScore += 30;
  
  return fraudScore;
};

module.exports = { detectFraud };
