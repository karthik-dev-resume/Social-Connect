'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Heart, MessageCircle, Share2, MoreVertical } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { apiRequest } from '@/lib/api/client'
import { toast } from 'sonner'
import Link from 'next/link'
import type { Post } from '@/lib/db/types'
import { useAuth } from '@/lib/hooks/use-auth'

interface PostCardProps {
  post: Post
  onUpdate?: () => void
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const author = post.author || (post as any).author
  const authorName = author ? `${author.first_name} ${author.last_name}` : 'Unknown'
  const authorUsername = author?.username || 'unknown'
  const initials = author ? `${author.first_name[0]}${author.last_name[0]}`.toUpperCase() : 'U'

  const handleLike = async () => {
    if (loading) return
    setLoading(true)

    try {
      if (isLiked) {
        await apiRequest(`/api/posts/${post.id}/like`, { method: 'DELETE' })
        setIsLiked(false)
        setLikeCount((prev) => Math.max(0, prev - 1))
      } else {
        await apiRequest(`/api/posts/${post.id}/like`, { method: 'POST' })
        setIsLiked(true)
        setLikeCount((prev) => prev + 1)
      }
      onUpdate?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to like post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href={`/profile/${author?.id || post.author_id}`}>
              <Avatar>
                <AvatarImage src={author?.avatar_url} alt={authorName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link href={`/profile/${author?.id || post.author_id}`}>
                <p className="font-semibold hover:underline">{authorName}</p>
              </Link>
              <p className="text-sm text-gray-500">@{authorUsername}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
            {user?.id === post.author_id && (
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
        {post.image_url && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={post.image_url}
              alt="Post image"
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        <div className="flex items-center space-x-4 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={loading}
            className={isLiked ? 'text-red-500' : ''}
          >
            <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            {likeCount}
          </Button>
          <Link href={`/posts/${post.id}`}>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              {post.comment_count}
            </Button>
          </Link>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

