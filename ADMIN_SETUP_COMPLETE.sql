-- Complete Admin Setup - Run this in Supabase SQL Editor
-- This creates the admins table and the karthik.admin user

-- Step 1: Create Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Username validation constraint (allows dots for admin usernames like karthik.admin)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'admin_username_format'
    ) THEN
        ALTER TABLE admins ADD CONSTRAINT admin_username_format CHECK (
            username ~ '^[a-zA-Z0-9_.]{3,30}$'
        );
    ELSE
        -- Update existing constraint if it exists
        ALTER TABLE admins DROP CONSTRAINT IF EXISTS admin_username_format;
        ALTER TABLE admins ADD CONSTRAINT admin_username_format CHECK (
            username ~ '^[a-zA-Z0-9_.]{3,30}$'
        );
    END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- Trigger function (should already exist from users table setup)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 2: Create Admin User (karthik.admin / test@123)
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

-- Step 3: Verify
SELECT id, email, username, first_name, last_name, is_active, created_at
FROM admins
WHERE username = 'karthik.admin';

