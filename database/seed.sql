



USE crm_database;

INSERT INTO leads (name, email, phone, source, status, notes) VALUES
('John Doe', 'john.doe@example.com', '+1234567890', 'website_form', 'new', '[]'),
('Jane Smith', 'jane.smith@example.com', '+1234567891', 'referral', 'contacted', '[]'),
('Bob Johnson', 'bob.johnson@example.com', '+1234567892', 'social_media', 'converted', '[]'),
('Alice Brown', 'alice.brown@example.com', '+1234567893', 'email_campaign', 'new', '[]'),
('Charlie Wilson', 'charlie.wilson@example.com', '+1234567894', 'website_form', 'contacted', '[]');

SELECT 
    COUNT(*) as total_leads,
    SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_leads,
    SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted_leads,
    SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted_leads
FROM leads;