const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const User = require('./models/User');

const createTestUser = async () => {
  try {
    // Sync database first
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { email: 'admin@example.com' } 
    });
    
    if (existingUser) {
      console.log('✅ Test user already exists!');
      console.log('📧 Email: admin@example.com');
      console.log('🔑 Password: password123');
      console.log('User ID:', existingUser.id);
      process.exit(0);
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Create test user
    const testUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    });
    
    console.log('✅ Test user created successfully!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: password123');
    console.log('🆔 User ID:', testUser.id);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Details:', error.errors ? error.errors.map(e => e.message) : error);
    process.exit(1);
  }
};

createTestUser();