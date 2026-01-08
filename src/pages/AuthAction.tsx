import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { auth } from '../lib/firebase'
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
  checkActionCode,
} from 'firebase/auth'

export default function AuthAction() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || ''
  const actionCode = searchParams.get('oobCode') || ''
  const continueUrl = searchParams.get('continueUrl') || ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // resetPassword state
  const [email, setEmail] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetMessage, setResetMessage] = useState<string | null>(null)
  const [resetMessageColor, setResetMessageColor] = useState<'red' | 'green' | 'gray'>('gray')

  const pageTitle = useMemo(() => {
    switch (mode) {
      case 'resetPassword':
        return 'Reset Password • MacroAura'
      case 'verifyEmail':
        return 'Verify Email • MacroAura'
      case 'recoverEmail':
        return 'Recover Email • MacroAura'
      default:
        return 'Auth Action • MacroAura'
    }
  }, [mode])

  useEffect(() => {
    async function run() {
      if (!actionCode) {
        setError('Invalid action link.')
        setLoading(false)
        return
      }

      try {
        if (mode === 'resetPassword') {
          const foundEmail = await verifyPasswordResetCode(auth, actionCode)
          setEmail(foundEmail)
        } else if (mode === 'verifyEmail') {
          await applyActionCode(auth, actionCode)
        } else if (mode === 'recoverEmail') {
          // Check info, then apply action to restore email
          await checkActionCode(auth, actionCode)
          await applyActionCode(auth, actionCode)
        } else {
          setError('Unknown action mode.')
        }
      } catch (e) {
        if (mode === 'resetPassword') {
          setError('This password reset link is invalid or has expired.')
        } else if (mode === 'verifyEmail') {
          setError('This verification link is invalid or has expired.')
        } else if (mode === 'recoverEmail') {
          setError('This email recovery link is invalid or has expired.')
        } else {
          setError('An error occurred while processing this action.')
        }
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [mode, actionCode])

  async function onResetSubmit() {
    setResetMessage(null)
    if (newPassword !== confirmPassword) {
      setResetMessage('Passwords do not match.')
      setResetMessageColor('red')
      return
    }
    if (newPassword.length < 6) {
      setResetMessage('Password must be at least 6 characters.')
      setResetMessageColor('red')
      return
    }
    try {
      await confirmPasswordReset(auth, actionCode, newPassword)
      setResetMessage('Password reset successful! You can now sign in.')
      setResetMessageColor('green')
      if (continueUrl) {
        setTimeout(() => (window.location.href = continueUrl), 1500)
      }
    } catch (err: any) {
      setResetMessage('Error: ' + (err?.message || 'Unknown error'))
      setResetMessageColor('red')
    }
  }

  return (
    <div className="min-h-screen bg-surface text-gray-900 font-sans selection:bg-main/20 selection:text-main-dark overflow-x-hidden">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Handle Firebase auth actions: reset password, verify email, or recover email." />
        <link rel="canonical" href="https://www.macroaura.com/auth/action" />
      </Helmet>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white shadow-xl border border-gray-100 p-8">
            {loading && (
              <div className="flex items-center justify-center py-10">
                <span className="text-gray-600">Processing...</span>
              </div>
            )}

            {!loading && error && (
              <div>
                <h2 className="text-2xl font-display font-bold text-red-600 mb-3">Error</h2>
                <p className="text-gray-700">{error}</p>
              </div>
            )}

            {!loading && !error && mode === 'resetPassword' && (
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-1">Reset Your Password</h2>
                {email && (
                  <p className="text-sm text-gray-500 mb-6">for {email}</p>
                )}
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-main focus:outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-main focus:outline-none"
                  />
                  <button
                    onClick={onResetSubmit}
                    className="mt-2 inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-gray-800"
                  >
                    Reset Password
                  </button>
                  {resetMessage && (
                    <p
                      className={
                        resetMessageColor === 'red'
                          ? 'text-red-600 mt-3'
                          : resetMessageColor === 'green'
                          ? 'text-green-600 mt-3'
                          : 'text-gray-600 mt-3'
                      }
                    >
                      {resetMessage}
                    </p>
                  )}
                </div>
              </div>
            )}

            {!loading && !error && mode === 'verifyEmail' && (
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Email Verification</h2>
                <p className="text-green-600">Your email has been verified! You can close this page.</p>
              </div>
            )}

            {!loading && !error && mode === 'recoverEmail' && (
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Email Recovery</h2>
                <p className="text-gray-700">Your email has been restored.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
