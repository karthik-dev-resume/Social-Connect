import { NextRequest } from 'next/server'
import { requireAdmin, type AuthenticatedRequest } from '@/lib/middleware/auth'
import { getPostById, deletePost } from '@/lib/db/queries'

async function handler(req: AuthenticatedRequest, { params }: { params: { post_id: string } }) {
  try {
    const postId = params.post_id

    if (req.method === 'DELETE') {
      const post = await getPostById(postId)
      if (!post) {
        return Response.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }

      const success = await deletePost(postId)
      if (!success) {
        return Response.json(
          { error: 'Failed to delete post' },
          { status: 500 }
        )
      }

      return Response.json({ message: 'Post deleted successfully' })
    }

    return Response.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  } catch (error) {
    console.error('Admin delete post error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const DELETE = requireAdmin(handler)

