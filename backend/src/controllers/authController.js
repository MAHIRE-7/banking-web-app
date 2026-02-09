const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/mysql');
const Account = require('../models/Account');

exports.register = async (req, res) => {
  try {
    const { email, password, full_name, role = 'user' } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query(
      'INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, full_name, role]
    );
    
    if (role === 'user') {
      const accountNumber = 'ACC' + Date.now() + Math.floor(Math.random() * 1000);
      await Account.create({
        userId: result.insertId,
        accountNumber,
        balance: 0
      });
    }
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account inactive' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, role: user.role, name: user.full_name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
