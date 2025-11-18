-- Create admin user: karthik.admin
-- Run this in Supabase SQL Editor to create the admin user

-- First, check if user exists
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id UUID;
BEGIN
    -- Check if karthik.admin exists
    SELECT EXISTS(SELECT 1 FROM users WHERE username = 'karthik.admin') INTO user_exists;
    
    IF user_exists THEN
        -- Update existing user to admin
        UPDATE users 
        SET role = 'admin', 
            is_active = true
        WHERE username = 'karthik.admin';
        RAISE NOTICE 'User karthik.admin updated to admin';
    ELSE
        -- Create new admin user
        -- Note: You'll need to hash the password 'test@123' first
        -- For now, this creates the user structure - you'll need to set password_hash
        INSERT INTO users (
            email,
            username,
            password_hash,
            first_name,
            last_name,
            role,
            is_active,
            is_verified
        ) VALUES (
            'karthik.admin@vega.com',
            'karthik.admin',
            '$2a$10$YourHashedPasswordHere', -- Replace with actual bcrypt hash of 'test@123'
            'Karthik',
            'Admin',
            'admin',
            true,
            true
        );
        RAISE NOTICE 'Admin user karthik.admin created';
    END IF;
END $$;

-- To hash the password 'test@123', you can:
-- 1. Use an online bcrypt generator: https://bcrypt-generator.com/
-- 2. Or use Node.js: require('bcryptjs').hashSync('test@123', 10)
-- 3. Or register the user normally first, then run: UPDATE users SET role = 'admin' WHERE username = 'karthik.admin';

