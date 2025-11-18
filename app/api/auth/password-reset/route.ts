import { NextRequest } from 'next/server'
import { getUserByEmail } from '@/lib/db/queries'
import { z } from 'zod'

const passwordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = passwordResetSchema.parse(body)

    // Check if user exists
    const user = await getUserByEmail(validated.email)
    
    // Always return success to prevent email enumeration
    // In production, send email with reset link
    if (user) {
      // TODO: Send password reset email with token
      // For now, just return success
    }

    return Response.json({
      message: 'If an account exists with this email, a password reset link has been sent.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Password reset error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

