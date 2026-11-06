import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : (typeof process !== 'undefined' ? process.env : {})

const supabaseUrl = env?.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Checks whether valid Supabase environment variables are present.
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false
  if (
    supabaseUrl.includes('your-project-id') ||
    supabaseUrl.includes('example.com') ||
    supabaseAnonKey.includes('your-anon-key')
  ) {
    return false
  }
  return true
}

// Fallback dummy URL so createClient does not throw on module evaluation if unconfigured
const effectiveUrl = isSupabaseConfigured() ? supabaseUrl! : 'https://placeholder.supabase.co'
const effectiveKey = isSupabaseConfigured() ? supabaseAnonKey! : 'placeholder-anon-key'

export const supabase: SupabaseClient<Database> = createClient<Database>(
  effectiveUrl,
  effectiveKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)

if (!isSupabaseConfigured() && typeof window !== 'undefined') {
  console.info(
    '%c[TRL Workstation] Supabase credentials not detected in .env.local. Running in local demo authentication mode.',
    'color: #3b82f6; font-weight: bold;'
  )
}
