import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Lock, Mail, User, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react'

export const SignupPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!email || !password) {
      setErrorMessage('Please fill in all required credentials.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.')
      return
    }

    setIsSubmitting(true)
    const { error } = await signUp(email, password, displayName)
    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.message || 'Signup failed. Please try again.')
    } else {
      setSuccessMessage('Account initialized successfully. Redirecting to workstation...')
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient grid pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Terminal Header & Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-mono font-black text-sm">
              TRL
            </div>
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
            Trading Research Lab
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Create your account. Set up your private research environment.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#111622] border border-[#1e273a] rounded-lg shadow-2xl p-6 sm:p-8 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Trader Name / Handle (Optional)"
              type="text"
              placeholder="e.g. Alex Vance"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              disabled={isSubmitting}
            />

            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              placeholder="trader@tradinglab.internal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              disabled={isSubmitting}
              required
            />

            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="•••••••••••• (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              disabled={isSubmitting}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              disabled={isSubmitting}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full font-mono text-xs font-bold uppercase tracking-wider"
              isLoading={isSubmitting}
            >
              Create Account
            </Button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-[#1a2334] text-center text-xs text-slate-400">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors font-mono"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>Encrypted PostgreSQL • Automated Profile Provisioning</span>
        </div>
      </div>
    </div>
  )
}

