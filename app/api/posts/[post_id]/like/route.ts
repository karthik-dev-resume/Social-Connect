import { NextRequest } from 'next/server'
import { requireAuth, type AuthenticatedRequest } from '@/lib/middleware/auth'
import { createLike, deleteLike, checkLike, getPostById } from '@/lib/db/queries'

async function handler(req: AuthenticatedRequest, { params }: { params: { post_id: string } }) {
  try {
    const postId = params.post_id

    // Check if post exists
    const post = await getPostById(postId)
    if (!post) {
      return Response.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (req.method === 'POST') {
      // Check if already liked
      const isLiked = await checkLike(postId, req.user!.userId)
      if (isLiked) {
        return Response.json(
          { error: 'Post already liked' },
          { status: 400 }
        )
      }

      const like = await createLike(postId, req.user!.userId)
      if (!like) {
        return Response.json(
          { error: 'Failed to like post' },
          { status: 500 }
        )
      }

      // Get updated post
      const updatedPost = await getPostById(postId)
      return Response.json({
        message: 'Post liked successfully',
        post: updatedPost,
      })
    }

    if (req.method === 'DELETE') {
      const success = await deleteLike(postId, req.user!.userId)
      if (!success) {
        return Response.json(
          { error: 'Failed to unlike post' },
          { status: 500 }
        )
      }

      // Get updated post
      const updatedPost = await getPostById(postId)
      return Response.json({
        message: 'Post unliked successfully',
        post: updatedPost,
      })
    }

    return Response.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  } catch (error) {
    console.error('Like/unlike error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = requireAuth(handler)
export const DELETE = requireAuth(handler)

