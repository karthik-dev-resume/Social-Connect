import { getUserById, getUserStats } from '@/lib/db/queries'
import { requireAuth, type AuthenticatedRequest, type RouteContext } from '@/lib/middleware/auth'
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
      console.error('User ID is missing from route parameters')
      return Response.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const user = await getUserById(userId)
    if (!user) {
      console.error(`User not found: ${userId}`)
      return Response.json(
        { error: 'User not found', userId },
        { status: 404 }
      )
    }

    // Allow viewing profile regardless of visibility
    // Posts will be filtered separately based on visibility

    const stats = await getUserStats(userId)
    const { password_hash: _, ...userResponse } = user as User & { password_hash?: string }

    return Response.json({
      ...userResponse,
      ...stats,
    })
  } catch (error) {
    console.error('Get user error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(handler)

