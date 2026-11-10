import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../supabase/client'
import { updatePassword } from '../api/auth'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [checked, setChecked] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // The reset link signs the user in with a short recovery session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') { setReady(true); setChecked(true) }
    })
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
      setTimeout(() => setChecked(true), 1500)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    const result = await updatePassword(password)
    setLoading(false)
    if (!result.success) { setError(result.error); return }
    setDone(true)
    await supabase.auth.signOut()
    setTimeout(() => navigate('/login'), 2500)
  }

  const inputClass = "w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-teal-600 to-blue-800 animate-gradient p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 animate-scale-in">
        {done ? (
          <div className="text-center">
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-7 w-7 text-teal-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Password updated</h1>
            <p className="text-slate-500 text-sm">Taking you to sign in...</p>
          </div>
        ) : !ready && checked ? (
          <div className="text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-7 w-7 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Link invalid or expired</h1>
            <p className="text-slate-500 text-sm mb-6">Please request a new password reset link.</p>
            <Link to="/forgot-password" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700">
              Request new link
            </Link>
          </div>
        ) : !ready ? (
          <div className="py-10 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Set a new password</h1>
            <p className="text-slate-500 text-sm mb-6">Choose a password with at least 8 characters.</p>
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input type="password" required placeholder="New password" value={password}
                  onChange={(e) => setPassword(e.target.value)} className={inputClass} />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input type="password" required placeholder="Confirm new password" value={confirm}
                  onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50 active:scale-[0.98]">
                {loading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPassword