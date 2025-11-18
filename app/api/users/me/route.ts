import { NextRequest } from 'next/server'
import { requireAuth, type AuthenticatedRequest } from '@/lib/middleware/auth'
import { getUserById, updateUser, getUserStats } from '@/lib/db/queries'
import type { User } from '@/lib/db/types'
import { z } from 'zod'

const updateProfileSchema = z.object({
  bio: z.string().max(160).optional(),
  avatar_url: z.string().url().optional().nullable(),
  website: z.string().url().optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  profile_visibility: z.enum(['public', 'private', 'followers_only']).optional(),
})

async function handler(req: AuthenticatedRequest) {
  try {
    if (req.method === 'GET') {
      const user = await getUserById(req.user!.userId)
      if (!user) {
        return Response.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      const stats = await getUserStats(user.id)
      const { password_hash: _, ...userResponse } = user as User & { password_hash?: string }

      return Response.json({
        ...userResponse,
        ...stats,
      })
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const body = await req.json()
      const validated = updateProfileSchema.parse(body)

      const user = await getUserById(req.user!.userId)
      if (!user) {
        return Response.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Convert null to undefined for optional fields
      const updates = {
        ...validated,
        avatar_url: validated.avatar_url ?? undefined,
        website: validated.website ?? undefined,
        location: validated.location ?? undefined,
      }

      const updatedUser = await updateUser(user.id, updates)
      if (!updatedUser) {
        return Response.json(
          { error: 'Failed to update profile' },
          { status: 500 }
        )
      }

      const stats = await getUserStats(updatedUser.id)
      const { password_hash: _, ...userResponse } = updatedUser as User & { password_hash?: string }

      return Response.json({
        ...userResponse,
        ...stats,
      })
    }

    return Response.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Profile error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(handler)
export const PUT = requireAuth(handler)
export const PATCH = requireAuth(handler)

