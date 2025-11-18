import { NextRequest } from 'next/server'
import { requireAuth, type AuthenticatedRequest } from '@/lib/middleware/auth'
import { getUserById, updateUser } from '@/lib/db/queries'
import { comparePassword, hashPassword } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const changePasswordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
})

async function handler(req: AuthenticatedRequest) {
  try {
    const body = await req.json()
    const validated = changePasswordSchema.parse(body)

    const user = await getUserById(req.user!.userId)
    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify current password
    const supabase = createAdminClient()
    const { data: userData } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', user.id)
      .single()

    if (!userData || !userData.password_hash) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const isValidPassword = await comparePassword(validated.current_password, userData.password_hash)
    if (!isValidPassword) {
      return Response.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash new password
    const newPasswordHash = await hashPassword(validated.new_password)

    // Update password
    await supabase
      .from('users')
      .update({ password_hash: newPasswordHash })
      .eq('id', user.id)

    return Response.json({ message: 'Password changed successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Change password error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = requireAuth(handler)

