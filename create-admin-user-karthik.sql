-- Create admin user: karthik.admin with password: test@123
-- Run this AFTER creating the admins table

INSERT INTO admins (
    email,
    username,
    password_hash,
    first_name,
    last_name,
    is_active
) VALUES (
    'karthik.admin@vega.com',
    'karthik.admin',
    '$2b$10$KLMlkSYDl4YkDg0gJaSp4OkFYSluMVTOYsgzyhAlEG1oq5s5BBMwW', -- Hash of 'test@123'
    'Karthik',
    'Admin',
    true
)
ON CONFLICT (username) DO UPDATE
SET 
    password_hash = EXCLUDED.password_hash,
    is_active = true;

-- Verify the admin was created
SELECT id, email, username, first_name, last_name, is_active, created_at
FROM admins
WHERE username = 'karthik.admin';
