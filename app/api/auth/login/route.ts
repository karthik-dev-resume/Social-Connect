import { NextRequest } from 'next/server'
import { getUserByEmail, getUserByUsername, updateUser, getAdminByUsername, getAdminByEmail, updateAdmin } from '@/lib/db/queries'
import { comparePassword, generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import type { User } from '@/lib/db/types'
import { z } from 'zod'

const loginSchema = z.object({
  email_or_username: z.string().min(1),
  password: z.string().min(1),
  login_type: z.enum(['user', 'admin']).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = loginSchema.parse(body)

    const supabase = createAdminClient()
    let user: User | null = null
    let isAdmin = false
    const loginType = validated.login_type || 'admin' // Default to 'admin' for backward compatibility

    // Only check admins table if login_type is 'admin'
    if (loginType === 'admin') {
      // First, try to find in admins table
      let admin = await getAdminByUsername(validated.email_or_username)
      if (!admin) {
        admin = await getAdminByEmail(validated.email_or_username)
      }

      if (admin) {
        console.log('Admin found:', admin.username)
        // Check if admin is active
        if (!admin.is_active) {
          return Response.json(
            { error: 'Account is deactivated' },
            { status: 403 }
          )
        }

        // Verify admin password
        const isValidPassword = await comparePassword(validated.password, admin.password_hash)
        if (!isValidPassword) {
          return Response.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          )
        }

        // Update last login
        await updateAdmin(admin.id, { last_login: new Date().toISOString() })

        // Convert admin to user format for response
        user = {
          id: admin.id,
          email: admin.email,
          username: admin.username,
          first_name: admin.first_name,
          last_name: admin.last_name,
          role: 'admin',
          profile_visibility: admin.profile_visibility || 'public',
          is_active: admin.is_active,
          is_verified: true,
          last_login: admin.last_login,
          created_at: admin.created_at,
          updated_at: admin.updated_at,
          bio: admin.bio,
          avatar_url: admin.avatar_url,
          website: admin.website,
          location: admin.location,
        } as User
        isAdmin = true
      }
    }

    // If not found in admin table (or login_type is 'user'), check users table
    if (!user) {
      // Try to find in users table
      user = await getUserByEmail(validated.email_or_username)
      if (!user) {
        user = await getUserByUsername(validated.email_or_username)
      }

      if (!user) {
        return Response.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      // Check if user is active
      if (!user.is_active) {
        return Response.json(
          { error: 'Account is deactivated' },
          { status: 403 }
        )
      }

      // Verify password
      const { data: userData } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', user.id)
        .single()

      if (!userData || !userData.password_hash) {
        return Response.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      const isValidPassword = await comparePassword(validated.password, userData.password_hash)
      if (!isValidPassword) {
        return Response.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      // Update last login
      await updateUser(user.id, { last_login: new Date().toISOString() })
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: isAdmin ? 'admin' : (user.role as 'user' | 'admin'),
    }

    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    // Store refresh token
    await supabase.from('refresh_tokens').insert({
      token: refreshToken,
      user_id: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })

    // Remove password_hash from response
    const { password_hash: _, ...userResponse } = user as User & { password_hash?: string }

    return Response.json({
      user: userResponse,
      access_token: accessToken,
      refresh_token: refreshToken,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Login error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

