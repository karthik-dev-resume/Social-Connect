import { NextRequest } from 'next/server'
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserById } from '@/lib/db/queries'
import { z } from 'zod'

const refreshSchema = z.object({
  refresh_token: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = refreshSchema.parse(body)

    // Verify refresh token
    let payload
    try {
      payload = verifyRefreshToken(validated.refresh_token)
    } catch (error) {
      return Response.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      )
    }

    // Check if token exists in database
    const supabase = createAdminClient()
    const { data: tokenData } = await supabase
      .from('refresh_tokens')
      .select('*')
      .eq('token', validated.refresh_token)
      .single()

    if (!tokenData) {
      return Response.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      )
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      await supabase
        .from('refresh_tokens')
        .delete()
        .eq('token', validated.refresh_token)

      return Response.json(
        { error: 'Refresh token expired' },
        { status: 401 }
      )
    }

    // Get user
    const user = await getUserById(payload.userId)
    if (!user || !user.is_active) {
      return Response.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      )
    }

    // Generate new tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as 'user' | 'admin',
    }

    const accessToken = generateAccessToken(tokenPayload)
    const newRefreshToken = generateRefreshToken(tokenPayload)

    // Delete old refresh token and store new one
    await supabase
      .from('refresh_tokens')
      .delete()
      .eq('token', validated.refresh_token)

    await supabase.from('refresh_tokens').insert({
      token: newRefreshToken,
      user_id: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })

    return Response.json({
      access_token: accessToken,
      refresh_token: newRefreshToken,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Token refresh error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

