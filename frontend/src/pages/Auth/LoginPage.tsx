import LoginForm from '../../module/auth/LoginForm'
import PageWrapper from '../../components/shared/PageWrapper'
import Badge from '../../components/shared/Badge'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { authService } from '../../services/auth'
import { authStorage } from '../../services/authStorage'
import { useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { validateLogin, validateLoginFields } from '../../utils/validators/authValidators'
import type { LoginFieldErrors } from '../../utils/validators/authValidators'

interface LoginData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

const LoginPage = () => {
  const [data, setData] = useState<LoginData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const navigate = useNavigate()
  const isMountedRef = useRef(true)
  const { scrollY } = useScroll()
  const scatterSlow = useTransform(scrollY, [0, 500], [0, -30])
  const scatterFast = useTransform(scrollY, [0, 500], [0, 45])
  const scatterOpp = useTransform(scrollY, [0, 500], [0, -60])

  useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])

  const handleEmailChange = useCallback((value: string) => {
    setData((prev) => ({ ...prev, email: value }))
  }, [])

  const handlePasswordChange = useCallback((value: string) => {
    setData((prev) => ({ ...prev, password: value }))
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!isMountedRef.current) return
    const fieldValidation = validateLoginFields({ email: data.email, password: data.password })
    const hasFieldErrors = Object.values(fieldValidation).some(Boolean)
    setFieldErrors(fieldValidation)
    if (hasFieldErrors) {
      const firstError = fieldValidation.email || fieldValidation.password || 'Please fix the highlighted fields.'
      setError('Please fix the highlighted fields.')
      notifications.show({ title: 'Validation error', message: firstError, color: 'red' })
      return
    }
    const validationError = validateLogin({ email: data.email, password: data.password })
    if (validationError) {
      setError(validationError)
      notifications.show({ title: 'Validation error', message: validationError, color: 'red' })
      return
    }
    setError('')
    setIsLoading(true)
    try {
      const result = await authService.login({ email: data.email, password: data.password })
      authStorage.setAccessToken(result.accessToken)
      authStorage.setUser(result.user)
      if (result.refreshToken) authStorage.setRefreshToken(result.refreshToken)
      notifications.show({ title: 'Welcome back', message: 'Login successful', color: 'green' })
      navigate('/dashboard')
    } catch (err: unknown) {
      if (!isMountedRef.current) return
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      notifications.show({ title: 'Login failed', message, color: 'red' })
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [data.email, data.password, navigate])

  return (
    <PageWrapper className="bg-surface">
      <div className="mx-auto w-full max-w-6xl px-6 relative">
        {/* floating blobs */}
        <motion.div className="pointer-events-none absolute -left-8 top-32 h-16 w-16 rounded-full bg-primary/10" animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="pointer-events-none absolute left-20 top-64 h-8 w-8 rounded-full bg-secondary/20" animate={{ y: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="pointer-events-none absolute right-12 top-24 h-10 w-10 rounded-full bg-primary/10" animate={{ y: [0, -5, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="pointer-events-none absolute right-32 bottom-32 h-14 w-14 rounded-full bg-secondary/15" animate={{ y: [0, 7, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }} />

        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* left — branding + feature cards */}
          <motion.div
            className="relative flex flex-col items-center lg:items-start"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div style={{ y: scatterSlow }} className="pointer-events-none absolute -left-6 top-12 h-12 w-12 rounded-full bg-primary/10" />
            <motion.div style={{ y: scatterFast }} className="pointer-events-none absolute left-10 top-44 h-6 w-6 rounded-full bg-secondary/20" />
            <motion.div style={{ y: scatterOpp }} className="pointer-events-none absolute left-28 top-72 h-10 w-10 rounded-full bg-primary/15" />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-md text-center lg:text-left"
            >
              {/* Badge — Secure Access */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
              >
                <Badge
                  text="Secure Access"
                  variant="primary"
                  leadingIcon={
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                      <path d="M12 1 3 5v6c0 5.25 3.75 10.15 9 11.35C17.25 21.15 21 16.25 21 11V5l-9-4Zm-1 14-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6Z" />
                    </svg>
                  }
                  className="uppercase tracking-wide"
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
                className="mt-4 text-4xl font-extrabold leading-tight text-on-surface"
              >
                Welcome Back to{' '}
                <span className="text-primary">Intellectual Excellence</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45, ease: 'easeOut' }}
                className="mt-4 text-sm leading-relaxed text-on-surface-variant"
              >
                Continue your journey of precision validation and academic curation. Your workspace
                is ready for the next breakthrough.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.45, ease: 'easeOut' }}
                className="mt-6 h-1 w-8 rounded-full bg-primary mx-auto lg:mx-0"
              />

              {/* feature cards */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.45, ease: 'easeOut' }}
                className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <div className="rounded-2xl border border-surface-container bg-surface-container-low p-4 text-center sm:text-left shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary sm:mx-0">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M12 1 3 5v6c0 5.25 3.75 10.15 9 11.35C17.25 21.15 21 16.25 21 11V5l-9-4Z" />
                    </svg>
                  </div>
                  <div className="mt-3 flex items-center gap-2 justify-center sm:justify-start">
                    <h3 className="text-base font-bold text-on-surface">Secure Login</h3>
                    <Badge text="256-bit" variant="success" className="text-[10px] px-2 py-0.5" />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    End-to-end encrypted session with JWT token rotation.
                  </p>
                </div>

                <div className="rounded-2xl border border-surface-container bg-surface-container-low p-4 text-center sm:text-left shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary sm:mx-0">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M12 4a8 8 0 1 0 8 8 8.01 8.01 0 0 0-8-8Zm0 3a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 12 7Zm2 10h-4v-1.5h1v-3h-1V11h3v4.5h1Z" />
                    </svg>
                  </div>
                  <div className="mt-3 flex items-center gap-2 justify-center sm:justify-start">
                    <h3 className="text-base font-bold text-on-surface">Your Profile</h3>
                    <Badge text="Active" variant="primary" className="text-[10px] px-2 py-0.5" />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Access your submissions, reports and account settings.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* right — login card */}
          <div className="flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, x: 18, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full max-w-md rounded-3xl border border-surface-container bg-surface-container-lowest p-8 shadow-xl"
            >
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-on-surface">Sign In</h2>
                  <Badge
                    text="Login"
                    variant="info"
                    leadingIcon={
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                        <path d="M11 7 9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5Zm9 12h-8v2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-8v2h8v14Z" />
                      </svg>
                    }
                  />
                </div>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Enter your credentials to access your dashboard
                </p>
              </div>
              <LoginForm
                {...data}
                onEmailChange={handleEmailChange}
                onPasswordChange={handlePasswordChange}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
                fieldErrors={fieldErrors}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default LoginPage
