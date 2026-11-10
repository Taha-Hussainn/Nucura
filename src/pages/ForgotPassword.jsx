import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { requestPasswordReset } from '../api/auth'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await requestPasswordReset(email.trim())
    setLoading(false)
    // Same message whether or not the email exists, so accounts cannot be guessed
    if (!result.success && !/rate|seconds|too many/i.test(result.error)) { setSent(true); return }
    if (!result.success) { setError(result.error); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-teal-600 to-blue-800 animate-gradient p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 animate-scale-in">
        <Link to="/login" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />Back to sign in
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-7 w-7 text-teal-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Check your email</h1>
            <p className="text-slate-500 text-sm">
              If an account exists for <strong className="break-all">{email}</strong>, we've sent a link to reset your password.
              It may take a minute and can land in spam.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Forgot password?</h1>
            <p className="text-slate-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input type="email" required placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50 active:scale-[0.98]">
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword