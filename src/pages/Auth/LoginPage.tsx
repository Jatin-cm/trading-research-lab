import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, Info } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false)

  const { signIn, isConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const destination = (location.state as any)?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.')
      return
    }

    setIsSubmitting(true)
    const { error } = await signIn(email, password)
    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.message || 'Authentication failed. Please check your credentials.')
    } else {
      navigate(destination, { replace: true })
    }
  }

  const handleDemoLogin = async () => {
    setEmail('researcher@tradinglab.internal')
    setPassword('TRL-Quant-Pass-2026')
    setIsSubmitting(true)
    const { error } = await signIn('researcher@tradinglab.internal', 'TRL-Quant-Pass-2026')
    setIsSubmitting(false)
    if (!error) {
      navigate(destination, { replace: true })
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
            Welcome back. Access your personal trading workstation.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#111622] border border-[#1e273a] rounded-lg shadow-2xl p-6 sm:p-8 space-y-5">
          {!isConfigured && (
            <div className="p-3 rounded bg-blue-950/20 border border-blue-500/30 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-blue-300 font-semibold font-mono">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                Local Development Mode
              </div>
              <p className="text-[11px] text-blue-200/80 leading-relaxed">
                Supabase credentials not configured in <code>.env.local</code>. Click below to sign in instantly with a local simulated session.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDemoLogin}
                className="w-full text-xs border-blue-500/40 text-blue-300 hover:bg-blue-500/10"
              >
                Sign In as Demo Researcher
              </Button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                disabled={isSubmitting}
                required
              />
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] font-mono text-slate-400 hover:text-blue-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full font-mono text-xs font-bold uppercase tracking-wider"
              isLoading={isSubmitting}
            >
              Login to Workstation
            </Button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-[#1a2334] text-center text-xs text-slate-400">
            <span>Don't have an account? </span>
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors font-mono"
            >
              Create account
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>Zero-Knowledge Frontend • RLS Database Protected</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Password Recovery"
        description="Password reset link delivery via Supabase Auth"
        footer={
          <Button variant="primary" size="sm" onClick={() => setIsForgotModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-slate-300">
          <p>
            When connected to your active Supabase project, password recovery sends a secure cryptographic reset token directly to your verified email.
          </p>
          <div className="p-3 rounded bg-[#0b0e14] border border-[#1c2436] font-mono text-[11px] text-slate-400">
            Configuration: Supabase Project Settings → Auth → Email Templates → Reset Password.
          </div>
        </div>
      </Modal>
    </div>
  )
}

