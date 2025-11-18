# Admin Setup Guide

## How to Create an Admin User

### Method 1: Using SQL (Recommended)

1. **Go to Supabase Dashboard → SQL Editor**
2. **Run this SQL query:**

```sql
-- Make a user admin by email
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

Or by username:
```sql
UPDATE users 
SET role = 'admin' 
WHERE username = 'your-username';
```

3. **Verify the change:**
```sql
SELECT id, email, username, role, is_active 
FROM users 
WHERE role = 'admin';
```

### Method 2: During Registration (Manual)

When registering a new user, you can manually set the role in the database after registration, or modify the registration endpoint to accept an admin flag (not recommended for production without proper security).

## Admin Features

Once a user has `role = 'admin'`, they can:

### Access Admin Dashboard
- Navigate to `/admin` in your app
- View statistics, manage users, and manage posts

### Admin API Endpoints

All admin endpoints require:
- Valid JWT token with `role: 'admin'` in the payload
- Authorization header: `Bearer <access_token>`

#### Statistics
- `GET /api/admin/stats` - Get platform statistics

#### User Management
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/[user_id]` - Get user details
- `POST /api/admin/users/[user_id]/deactivate` - Deactivate a user

#### Post Management
- `GET /api/admin/posts` - List all posts
- `DELETE /api/admin/posts/[post_id]` - Delete any post

## Security Notes

- Admin routes are protected by `requireAdmin()` middleware
- Only users with `role = 'admin'` can access admin endpoints
- Admins cannot deactivate themselves
- All admin actions are logged (check server logs)

## Testing Admin Access

1. Make a user admin using Method 1 above
2. Log in with that user account
3. Navigate to `/admin` - you should see the admin dashboard
4. Try accessing admin API endpoints with the JWT token

