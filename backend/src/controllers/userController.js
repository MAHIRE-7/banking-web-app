const bcrypt = require('bcryptjs');
const { pool } = require('../config/mysql');

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, email, full_name, role, employee_id, status, created_at FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { email, password, full_name, employee_id } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      'INSERT INTO users (email, password, full_name, role, employee_id) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, full_name, 'admin', employee_id]
    );
    
    res.status(201).json({ message: 'Employee created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    
    await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
    
    res.json({ message: 'User status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
