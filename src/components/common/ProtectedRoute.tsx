import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoadingState } from '@/components/ui/LoadingState'

export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-6">
        <LoadingState
          message="Verifying workstation session..."
          subtext="Validating cryptographic token with security authority"
        />
      </div>
    )
  }

  if (!user) {
    // Redirect unauthenticated user to /login, remembering origin location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children ? <>{children}</> : <Outlet />
}

