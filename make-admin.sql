-- Make a user an admin
-- Run this in Supabase SQL Editor

-- Option 1: Make user admin by email
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Option 2: Make user admin by username
UPDATE users 
SET role = 'admin' 
WHERE username = 'your-username';

-- Option 3: Make user admin by ID
UPDATE users 
SET role = 'admin' 
WHERE id = 'user-uuid-here';

-- Verify the change
SELECT id, email, username, role, is_active 
FROM users 
WHERE role = 'admin';

