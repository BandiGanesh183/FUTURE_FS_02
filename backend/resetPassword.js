const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');

async function resetPassword() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await sequelize.query(`
      UPDATE users 
      SET password = '${hashedPassword}' 
      WHERE email = 'demo@crm.com'
    `);
    
    console.log('✅ Password reset for demo@crm.com');
    console.log('Email: demo@crm.com');
    console.log('Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

resetPassword();