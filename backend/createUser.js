const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');

async function createUser() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await sequelize.query(`
      INSERT INTO users (username, email, password, role, createdAt, updatedAt) 
      VALUES ('demo', 'demo@crm.com', '${hashedPassword}', 'admin', NOW(), NOW())
    `);
    
    console.log('✅ User created: demo@crm.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createUser();