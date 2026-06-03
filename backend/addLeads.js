const { sequelize } = require('./config/database');

async function addLeads() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Check current leads
    const [existing] = await sequelize.query('SELECT COUNT(*) as count FROM leads');
    console.log('Current leads count:', existing[0].count);

    if (existing[0].count > 0) {
      console.log('Leads already exist, skipping...');
      process.exit(0);
    }

    // Insert leads with valid values
    await sequelize.query(`INSERT INTO leads (name, email, phone, status, source, notes, createdAt, updatedAt) VALUES ('John Doe', 'john@example.com', '9876543210', 'new', 'website_form', 'Interested in product', NOW(), NOW())`);
    console.log('✓ Added lead 1');
    
    await sequelize.query(`INSERT INTO leads (name, email, phone, status, source, notes, createdAt, updatedAt) VALUES ('Jane Smith', 'jane@example.com', '9876543211', 'contacted', 'referral', 'Follow up next week', NOW(), NOW())`);
    console.log('✓ Added lead 2');
    
    await sequelize.query(`INSERT INTO leads (name, email, phone, status, source, notes, createdAt, updatedAt) VALUES ('Bob Johnson', 'bob@example.com', '9876543212', 'converted', 'social_media', 'Already purchased', NOW(), NOW())`);
    console.log('✓ Added lead 3');
    
    await sequelize.query(`INSERT INTO leads (name, email, phone, status, source, notes, createdAt, updatedAt) VALUES ('Alice Williams', 'alice@example.com', '9876543213', 'new', 'email_campaign', 'Requested demo', NOW(), NOW())`);
    console.log('✓ Added lead 4');
    
    await sequelize.query(`INSERT INTO leads (name, email, phone, status, source, notes, createdAt, updatedAt) VALUES ('Charlie Brown', 'charlie@example.com', '9876543214', 'contacted', 'website_form', 'Sent proposal', NOW(), NOW())`);
    console.log('✓ Added lead 5');

    // Verify
    const [leads] = await sequelize.query('SELECT COUNT(*) as count FROM leads');
    console.log('✅ Total leads now:', leads[0].count);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addLeads();