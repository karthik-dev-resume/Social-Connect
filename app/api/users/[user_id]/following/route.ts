import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/middleware/auth'
import { getUserFollowing } from '@/lib/db/queries'
import type { User } from '@/lib/db/types'

async function handler(req: NextRequest, { params }: { params: { user_id: string } }) {
  try {
    const userId = params.user_id
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const following = await getUserFollowing(userId, limit, offset)

    // Remove password_hash from all users
    const sanitizedFollowing = following.map((user) => {
      const { password_hash: _, ...sanitized } = user as User & { password_hash?: string }
      return sanitized
    })

    return Response.json({
      results: sanitizedFollowing,
      count: sanitizedFollowing.length,
    })
  } catch (error) {
    console.error('Get following error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(handler)

