# SocialConnect - Social Media Web Application

A comprehensive social media backend application built with Next.js, featuring user authentication, posts, social interactions, and admin management.

## Features

- **Authentication System**: JWT-based authentication with login/register/logout
- **User Profiles**: Basic profiles with bio, avatar, follower/following counts
- **Content Creation**: Text posts with single image upload capability
- **Social Interactions**: Follow/unfollow users, like posts, basic comment system
- **Personalised Feed**: Chronological feed showing posts from followed users
- **Real-time Notifications**: Live notifications using Supabase Real-Time Subscriptions
- **Basic Admin**: User management and post oversight

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: JWT tokens
- **File Storage**: Supabase Storage
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Real-time**: Supabase Realtime

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Create the database tables in Supabase SQL Editor (see Database Schema section below)

3. Create Storage Buckets:
   - Go to Storage in Supabase dashboard
   - Create a bucket named `avatars` (public)
   - Create a bucket named `posts` (public)

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

You can find your Supabase credentials in:
- Project Settings → API → Project URL (for `NEXT_PUBLIC_SUPABASE_URL`)
- Project Settings → API → anon/public key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Project Settings → API → service_role key (for `SUPABASE_SERVICE_ROLE_KEY`)

Generate secure random strings for JWT secrets (you can use `openssl rand -base64 32`).

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/token/refresh` - Refresh access token
- `POST /api/auth/password-reset` - Request password reset
- `POST /api/auth/password-reset-confirm` - Confirm password reset
- `POST /api/auth/change-password` - Change password (authenticated)

### Users

- `GET /api/users/me` - Get current user profile
- `PUT/PATCH /api/users/me` - Update current user profile
- `GET /api/users/{user_id}` - Get user profile
- `GET /api/users` - List users
- `POST /api/users/{user_id}/follow` - Follow user
- `DELETE /api/users/{user_id}/follow` - Unfollow user
- `GET /api/users/{user_id}/followers` - Get user followers
- `GET /api/users/{user_id}/following` - Get user following
- `POST /api/users/upload-avatar` - Upload avatar image

### Posts

- `GET /api/posts` - List posts (supports `?feed=true` and `?author_id=...`)
- `POST /api/posts` - Create post
- `GET /api/posts/{post_id}` - Get post
- `PUT/PATCH /api/posts/{post_id}` - Update post
- `DELETE /api/posts/{post_id}` - Delete post
- `POST /api/posts/upload-image` - Upload post image
- `POST /api/posts/{post_id}/like` - Like post
- `DELETE /api/posts/{post_id}/like` - Unlike post
- `GET /api/posts/{post_id}/comments` - Get post comments
- `POST /api/posts/{post_id}/comments` - Create comment
- `PUT/PATCH /api/posts/{post_id}/comments/{comment_id}` - Update comment
- `DELETE /api/posts/{post_id}/comments/{comment_id}` - Delete comment

### Admin

- `GET /api/admin/users` - List all users
- `GET /api/admin/users/{user_id}` - Get user details
- `POST /api/admin/users/{user_id}/deactivate` - Deactivate user
- `GET /api/admin/posts` - List all posts
- `DELETE /api/admin/posts/{post_id}` - Delete any post
- `GET /api/admin/stats` - Get statistics

## Database Schema

The application uses the following main tables:

- **users**: User accounts with profiles
- **posts**: User posts with content and images
- **follows**: Follow relationships between users
- **likes**: Post likes
- **comments**: Post comments
- **refresh_tokens**: JWT refresh token blacklist

The schema includes tables for users, posts, follows, likes, comments, and refresh_tokens with appropriate indexes and triggers.

## Project Structure

```
vega/
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin dashboard
│   ├── feed/             # Feed page
│   ├── login/            # Login page
│   ├── register/         # Register page
│   ├── profile/          # Profile pages
│   ├── posts/            # Post detail pages
│   └── settings/         # Settings page
├── components/           # React components
├── lib/
│   ├── api/              # API client utilities
│   ├── auth/             # Authentication utilities
│   ├── db/               # Database queries and types
│   ├── hooks/            # React hooks
│   └── supabase/         # Supabase client setup
└── middleware.ts         # Next.js middleware
```

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

## Notes

- Email verification is mentioned in requirements but not fully implemented (placeholder in registration)
- Password reset uses a placeholder implementation
- Real-time notifications are set up but may need additional Supabase Realtime configuration
- Make sure to configure Supabase Storage bucket policies for public access to avatars and posts

## License

This project is created for educational purposes.
