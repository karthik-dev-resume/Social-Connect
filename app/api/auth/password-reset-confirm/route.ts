import { NextRequest } from 'next/server'
import { z } from 'zod'

const passwordResetConfirmSchema = z.object({
  token: z.string(),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = passwordResetConfirmSchema.parse(body)

    return Response.json(
      { error: 'Password reset confirmation not fully implemented. Use change-password endpoint for authenticated users.' },
      { status: 501 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Password reset confirm error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

