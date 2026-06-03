const { sequelize } = require('./config/database');
const bcrypt = require('bcryptjs');

const checkUser = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Check if Users table exists
    const [tables] = await sequelize.query("SHOW TABLES");
    console.log('Tables in database:', tables);
    
    // Check if any users exist
    const [users] = await sequelize.query("SELECT * FROM Users");
    console.log('Users found:', users.length);
    
    if (users.length > 0) {
      console.log('\nUser details:');
      users.forEach(user => {
        console.log({
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
          password_hash: user.password.substring(0, 20) + '...'
        });
      });
    } else {
      console.log('No users found in database');
      
      // Create a user directly
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      await sequelize.query(`
        INSERT INTO Users (username, email, password, name, role, createdAt, updatedAt) 
        VALUES ('admin', 'admin@example.com', '${hashedPassword}', 'Admin User', 'admin', NOW(), NOW())
      `);
      
      console.log('\n✅ Test user created!');
      console.log('Email: admin@example.com');
      console.log('Password: password123');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkUser();