import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { User as SupabaseUser, Session, AuthError } from '@supabase/supabase-js'

export interface AuthProfile {
  id: string
  email: string
  displayName: string | null
  avatarUrl?: string | null
  createdAt?: string
}

const LOCAL_DEMO_USER_KEY = 'trl_demo_user_session'

export interface AuthResponse {
  user: SupabaseUser | null
  session: Session | null
  error: AuthError | Error | null
}

class AuthService {
  /**
   * Register a new user with email and password
   */
  async signUp(email: string, password: string, displayName?: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      // Demo simulated signup
      const mockId = `demo-usr-${Date.now()}`
      const mockUser = {
        id: mockId,
        app_metadata: {},
        user_metadata: { display_name: displayName || email.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email,
      } as unknown as SupabaseUser

      const mockSession = {
        access_token: 'demo-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'demo-refresh',
        user: mockUser,
      } as unknown as Session

      localStorage.setItem(LOCAL_DEMO_USER_KEY, JSON.stringify({ user: mockUser, session: mockSession }))
      return { user: mockUser, session: mockSession, error: null }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0],
          },
        },
      })
      return { user: data.user, session: data.session, error }
    } catch (err: any) {
      return { user: null, session: null, error: err }
    }
  }

  /**
   * Sign in existing user with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      // Demo simulated sign in
      const mockId = 'demo-researcher-01'
      const mockUser = {
        id: mockId,
        app_metadata: {},
        user_metadata: { display_name: email.split('@')[0] || 'Trader TRL' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email,
      } as unknown as SupabaseUser

      const mockSession = {
        access_token: 'demo-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'demo-refresh',
        user: mockUser,
      } as unknown as Session

      localStorage.setItem(LOCAL_DEMO_USER_KEY, JSON.stringify({ user: mockUser, session: mockSession }))
      return { user: mockUser, session: mockSession, error: null }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { user: data.user, session: data.session, error }
    } catch (err: any) {
      return { user: null, session: null, error: err }
    }
  }

  /**
   * Terminate current session
   */
  async signOut(): Promise<{ error: Error | null }> {
    localStorage.removeItem(LOCAL_DEMO_USER_KEY)
    if (!isSupabaseConfigured()) {
      return { error: null }
    }
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  /**
   * Retrieve active session
   */
  async getSession(): Promise<Session | null> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem(LOCAL_DEMO_USER_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          return parsed.session || null
        } catch {
          return null
        }
      }
      return null
    }

    const { data } = await supabase.auth.getSession()
    return data.session
  }

  /**
   * Retrieve active user
   */
  async getUser(): Promise<SupabaseUser | null> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem(LOCAL_DEMO_USER_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          return parsed.user || null
        } catch {
          return null
        }
      }
      return null
    }

    const { data } = await supabase.auth.getUser()
    return data.user
  }

  /**
   * Subscribe to auth changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    if (!isSupabaseConfigured()) {
      // Listen for local storage change event or manual dispatch
      const handler = () => {
        const stored = localStorage.getItem(LOCAL_DEMO_USER_KEY)
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            callback('SIGNED_IN', parsed.session)
          } catch {
            callback('SIGNED_OUT', null)
          }
        } else {
          callback('SIGNED_OUT', null)
        }
      }
      window.addEventListener('storage', handler)
      window.addEventListener('trl_demo_auth_change', handler)
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              window.removeEventListener('storage', handler)
              window.removeEventListener('trl_demo_auth_change', handler)
            },
          },
        },
      }
    }

    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session)
    })
  }
}

export const authService = new AuthService()

