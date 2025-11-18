import { NextRequest } from 'next/server'
import { requireAuth, type AuthenticatedRequest } from '@/lib/middleware/auth'
import { createAdminClient } from '@/lib/supabase/admin'

async function handler(req: AuthenticatedRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return Response.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      return Response.json(
        { error: 'Invalid file type. Only JPEG and PNG are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return Response.json(
        { error: 'File size exceeds 2MB limit' },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const supabase = createAdminClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${req.user!.userId}-${Date.now()}.${fileExt}`
    const filePath = `posts/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('posts')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return Response.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('posts')
      .getPublicUrl(filePath)

    return Response.json({
      image_url: publicUrl,
      message: 'Image uploaded successfully',
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = requireAuth(handler)

