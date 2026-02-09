const Account = require('../models/Account');

exports.getAccount = async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user.id });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAccountStatus = async (req, res) => {
  try {
    const { accountNumber, status } = req.body;
    const account = await Account.findOneAndUpdate(
      { accountNumber },
      { status },
      { new: true }
    );
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
