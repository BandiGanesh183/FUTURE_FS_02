const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({
  path: require('path').join(__dirname, '../.env')
});

const bcrypt = require('bcryptjs');

async function setupDatabase() {

  // Create MySQL connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  console.log('📀 Setting up database...');

  // Create database
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
  );

  // Use database
  await connection.query(
    `USE ${process.env.DB_NAME}`
  );

  // Create users table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') DEFAULT 'admin',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Create leads table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      source ENUM(
        'website_form',
        'referral',
        'social_media',
        'email_campaign',
        'other'
      ) DEFAULT 'website_form',

      status ENUM(
        'new',
        'contacted',
        'converted'
      ) DEFAULT 'new',

      notes TEXT,

      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // ======================================
  // CREATE ADMIN USER
  // ======================================

  // Password = rishi123
  const hashedPassword = await bcrypt.hash('rishi123', 10);

  // Insert admin user
  await connection.query(
    `
    INSERT INTO users
    (username, email, password, role)
    VALUES (?, ?, ?, ?)
    `,
    [
      'rishi',
      'rishi@crm.com',
      hashedPassword,
      'admin'
    ]
  );

  console.log('✅ Database setup complete!');

  console.log(`
=================================
📝 Admin Login Credentials

Username: rishi
Password: rishi123
=================================
  `);

  // Close connection
  await connection.end();
}

// Run setup
setupDatabase().catch((error) => {
  console.error('❌ Setup Error:', error);
});