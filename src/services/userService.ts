import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

class UserService {
  async getProfile(userId: string): Promise<{ profile: ProfileRow | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return {
        profile: {
          id: userId,
          email: 'researcher@tradinglab.internal',
          display_name: 'Alex Vance (Quant Lead)',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        error: null,
      }
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return { profile: data, error: null }
    } catch (err: any) {
      return { profile: null, error: err }
    }
  }

  async updateProfile(
    userId: string,
    updates: ProfileUpdate
  ): Promise<{ profile: ProfileRow | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return {
        profile: {
          id: userId,
          email: updates.email || 'researcher@tradinglab.internal',
          display_name: updates.display_name || 'Alex Vance',
          avatar_url: updates.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        error: null,
      }
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { profile: data, error: null }
    } catch (err: any) {
      return { profile: null, error: err }
    }
  }
}

export const userService = new UserService()

