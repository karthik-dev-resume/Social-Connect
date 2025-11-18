-- Setup Admin User: karthik.admin
-- IMPORTANT: First register the user normally through the app with:
--   Username: karthik.admin
--   Password: test@123
--   Email: any email (e.g., karthik.admin@vega.com)
--
-- Then run this SQL to make them admin:

UPDATE users 
SET role = 'admin' 
WHERE username = 'karthik.admin';

-- Verify it worked:
SELECT id, email, username, role, is_active 
FROM users 
WHERE username = 'karthik.admin';

