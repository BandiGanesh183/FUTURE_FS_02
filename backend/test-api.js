const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');

const testLogin = async () => {
  try {
    // Get the user from database
    const [users] = await sequelize.query(`SELECT * FROM Users WHERE email = 'demo@crm.com'`);
    
    if (users.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    const user = users[0];
    console.log('User found:', {
      id: user.id,
      email: user.email,
      password_hash: user.password.substring(0, 20) + '...'
    });
    
    // Test password
    const isMatch = await bcrypt.compare('password123', user.password);
    console.log('Password match test:', isMatch);
    
    if (isMatch) {
      console.log('✅ Password is correct! Login would work!');
    } else {
      console.log('❌ Password does not match');
      
      // Create a new password hash
      const newHash = await bcrypt.hash('password123', 10);
      
      // Update user with new password
      await sequelize.query(`UPDATE Users SET password = '${newHash}' WHERE email = 'demo@crm.com'`);
      console.log('✅ Password has been reset! Try login again.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit();
  }
};

testLogin();