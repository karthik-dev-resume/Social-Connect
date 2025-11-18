import { NextRequest } from 'next/server'
import { requireAdmin, type AuthenticatedRequest } from '@/lib/middleware/auth'
import { createAdminClient } from '@/lib/supabase/admin'

async function handler(req: AuthenticatedRequest) {
  try {
    const supabase = createAdminClient()

    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get total posts
    const { count: totalPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Get active users today (users who logged in today)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: activeToday } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_login', today.toISOString())

    return Response.json({
      total_users: totalUsers || 0,
      total_posts: totalPosts || 0,
      active_today: activeToday || 0,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = requireAdmin(handler)

