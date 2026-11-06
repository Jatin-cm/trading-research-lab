import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { authService, AuthProfile } from '@/services/authService'
import { userService, ProfileRow } from '@/services/userService'
import { isSupabaseConfigured } from '@/lib/supabase'

export interface AuthContextType {
  user: User | null
  session: Session | null
  profile: ProfileRow | null
  loading: boolean
  isConfigured: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [loading, setLoading] = useState(true)

  const isConfigured = isSupabaseConfigured()

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      return
    }
    const { profile: userProfile } = await userService.getProfile(user.id)
    if (userProfile) {
      setProfile(userProfile)
    } else {
      // Fallback profile if row not created yet
      setProfile({
        id: user.id,
        email: user.email || '',
        display_name: (user.user_metadata?.display_name as string) || (user.email ? user.email.split('@')[0] : 'Trader'),
        avatar_url: null,
        created_at: user.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }
  }, [user])

  useEffect(() => {
    let mounted = true

    // Check active session on initial load
    authService.getSession().then((activeSession) => {
      if (!mounted) return
      setSession(activeSession)
      setUser(activeSession?.user || null)
      setLoading(false)
    })

    // Subscribe to auth state updates
    const { data: { subscription } } = authService.onAuthStateChange((_event, currentSession) => {
      if (!mounted) return
      setSession(currentSession)
      setUser(currentSession?.user || null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (user) {
      refreshProfile()
    } else {
      setProfile(null)
    }
  }, [user, refreshProfile])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const { user: authedUser, session: newSession, error } = await authService.signIn(email, password)
    setLoading(false)
    if (!error && authedUser) {
      setUser(authedUser)
      setSession(newSession)
      // Trigger event for local listener if in demo mode
      window.dispatchEvent(new Event('trl_demo_auth_change'))
      return { error: null }
    }
    return { error }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true)
    const { user: newUser, session: newSession, error } = await authService.signUp(email, password, displayName)
    setLoading(false)
    if (!error && newUser) {
      setUser(newUser)
      setSession(newSession)
      window.dispatchEvent(new Event('trl_demo_auth_change'))
      return { error: null }
    }
    return { error }
  }

  const signOut = async () => {
    setLoading(true)
    const { error } = await authService.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
    setLoading(false)
    window.dispatchEvent(new Event('trl_demo_auth_change'))
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

