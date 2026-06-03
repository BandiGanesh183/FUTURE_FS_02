const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');

const fixLogin = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Delete existing user if any
    await sequelize.query(`DELETE FROM Users WHERE email = 'demo@crm.com'`);
    
    // Create new user
    await sequelize.query(`
      INSERT INTO Users (username, email, password, name, role, createdAt, updatedAt) 
      VALUES ('demo', 'demo@crm.com', '${hashedPassword}', 'Demo User', 'admin', NOW(), NOW())
    `);
    
    console.log('✅ DEMO USER CREATED SUCCESSFULLY!');
    console.log('=====================================');
    console.log('📧 Email: demo@crm.com');
    console.log('🔑 Password: password123');
    console.log('=====================================');
    
    // Verify user was created
    const [users] = await sequelize.query(`SELECT * FROM Users WHERE email = 'demo@crm.com'`);
    
    if (users.length > 0) {
      console.log('✅ User verified in database!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixLogin();