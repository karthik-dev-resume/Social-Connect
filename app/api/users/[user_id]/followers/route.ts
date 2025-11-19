import { requireAuth, type AuthenticatedRequest, type RouteContext } from '@/lib/middleware/auth'
import { getUserFollowers } from '@/lib/db/queries'
import type { User } from '@/lib/db/types'

async function handler(req: AuthenticatedRequest, context: RouteContext) {
  try {
    if (!context.params) {
      return Response.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params
    const userId = resolvedParams.user_id

    if (!userId) {
      return Response.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const followers = await getUserFollowers(userId, limit, offset)

    // Remove password_hash from all users
    const sanitizedFollowers = followers.map((user) => {
      const { password_hash: _, ...sanitized } = user as User & { password_hash?: string }
      return sanitized
    })

    return Response.json({
      results: sanitizedFollowers,
      count: sanitizedFollowers.length,
    })
  } catch (error) {
    console.error('Get followers error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(handler)

