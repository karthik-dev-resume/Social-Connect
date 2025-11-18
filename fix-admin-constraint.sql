-- Fix admin username constraint to allow dots
-- Run this in Supabase SQL Editor

-- Drop existing constraint if it exists
ALTER TABLE admins DROP CONSTRAINT IF EXISTS admin_username_format;

-- Add new constraint that allows dots
ALTER TABLE admins ADD CONSTRAINT admin_username_format CHECK (
    username ~ '^[a-zA-Z0-9_.]{3,30}$'
);

-- Now try inserting the admin user again
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

-- Verify
SELECT id, email, username, first_name, last_name, is_active, created_at
FROM admins
WHERE username = 'karthik.admin';

