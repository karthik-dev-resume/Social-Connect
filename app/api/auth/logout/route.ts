import { NextRequest } from 'next/server'
import { requireAuth, type AuthenticatedRequest } from '@/lib/middleware/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { extractTokenFromHeader } from '@/lib/auth'

async function handler(req: AuthenticatedRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const refreshToken = extractTokenFromHeader(authHeader)

    if (refreshToken) {
      // Blacklist refresh token
      const supabase = createAdminClient()
      await supabase
        .from('refresh_tokens')
        .delete()
        .eq('token', refreshToken)
    }

    return Response.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = requireAuth(handler)

