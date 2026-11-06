import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export const BUCKET_NAME = 'trade-screenshots'

class StorageService {
  /**
   * Upload screenshot organized by user_id/trade_id/filename
   */
  async uploadTradeScreenshot(
    userId: string,
    tradeId: string,
    file: File
  ): Promise<{ path: string | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return {
        path: `mock/${userId}/${tradeId}/${file.name}`,
        error: null,
      }
    }

    try {
      const timestamp = Date.now()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `${userId}/${tradeId}/${timestamp}_${sanitizedName}`

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error
      return { path: data.path, error: null }
    } catch (err: any) {
      return { path: null, error: err }
    }
  }

  /**
   * Generates a secure time-limited signed URL for a private screenshot
   */
  async getSignedUrl(filePath: string, expiresIn: number = 3600): Promise<{ url: string | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800', error: null }
    }

    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(filePath, expiresIn)

      if (error) throw error
      return { url: data.signedUrl, error: null }
    } catch (err: any) {
      return { url: null, error: err }
    }
  }

  /**
   * Delete user screenshot
   */
  async deleteScreenshot(filePath: string): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { error: null }
    }

    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath])

      if (error) throw error
      return { error: null }
    } catch (err: any) {
      return { error: err }
    }
  }
}

export const storageService = new StorageService()

