const { sequelize } = require('./config/database');

async function addSampleLeads() {
  try {
    await sequelize.query(`
      INSERT INTO leads (name, email, phone, status, source, createdAt, updatedAt) 
      VALUES 
        ('John Doe', 'john@example.com', '9876543210', 'new', 'website_form', NOW(), NOW()),
        ('Jane Smith', 'jane@example.com', '9876543211', 'contacted', 'referral', NOW(), NOW()),
        ('Bob Johnson', 'bob@example.com', '9876543212', 'converted', 'social_media', NOW(), NOW()),
        ('Alice Williams', 'alice@example.com', '9876543213', 'new', 'email_campaign', NOW(), NOW()),
        ('Charlie Brown', 'charlie@example.com', '9876543214', 'contacted', 'website_form', NOW(), NOW())
    `);
    
    console.log('✅ 5 Sample leads added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addSampleLeads();