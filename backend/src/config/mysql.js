const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10
});

const initMySQL = async () => {
  try {
    const connection = await pool.getConnection();
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('superadmin', 'admin', 'user') NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        employee_id VARCHAR(50),
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    connection.release();
    console.log('MySQL connected and tables initialized');
  } catch (error) {
    console.error('MySQL error:', error);
    process.exit(1);
  }
};

module.exports = { pool, initMySQL };
