-- Migration script to update user roles to use the new enum system
-- Backup existing data before running this script

-- Update existing users to use the new role enum values
UPDATE users 
SET role = 'customer' 
WHERE role = 'user';

-- Set default role for users without role
UPDATE users 
SET role = 'customer' 
WHERE role IS NULL OR role = '';

-- Create a default admin user (change password and email as needed)
INSERT INTO users (username, email, password, first_name, last_name, role, is_active, email_verified) 
VALUES (
  'admin', 
  'admin@tienda-nba.com', 
  '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', -- Replace with hashed password
  'Admin', 
  'User', 
  'admin', 
  true, 
  true
) 
ON DUPLICATE KEY UPDATE role = 'admin';

-- Note: Replace the password hash with a real bcrypt hash of your desired admin password
-- You can generate a hash using: bcrypt.hash('your-password', 10)
