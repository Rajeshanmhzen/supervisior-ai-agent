import LoginForm from '../../module/auth/LoginForm'
import PageWrapper from '../../components/shared/PageWrapper'
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { authService } from '../../services/auth';
import { authStorage } from '../../services/authStorage';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { validateLogin, validateLoginFields } from '../../utils/validators/authValidators';
import type { LoginFieldErrors } from '../../utils/validators/authValidators';
interface LoginData{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
} 
const LoginPage = () => {
    const [data, setData] = useState<LoginData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
    const navigate = useNavigate();
    const isMountedRef = useRef(true);
    const { scrollY } = useScroll();
    const scatterSlow = useTransform(scrollY, [0, 500], [0, -30]);
    const scatterFast = useTransform(scrollY, [0, 500], [0, 45]);
    const scatterOpp = useTransform(scrollY, [0, 500], [0, -60]);

    useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    const handleEmailChange = useCallback((value: string) => {
      setData((prev) => ({ ...prev, email: value }));
    }, []);

    const handlePasswordChange = useCallback((value: string) => {
      setData((prev) => ({ ...prev, password: value }));
    }, []);

    const handleSubmit = useCallback(async () => {
      if (!isMountedRef.current) return;
    const fieldValidation = validateLoginFields({
      email: data.email,
      password: data.password,
    });
    const hasFieldErrors = Object.values(fieldValidation).some(Boolean);
    setFieldErrors(fieldValidation);
    if (hasFieldErrors) {
      const firstError = fieldValidation.email || fieldValidation.password || 'Please fix the highlighted fields.';
      setError('Please fix the highlighted fields.');
      notifications.show({
        title: 'Validation error',
        message: firstError,
        color: 'red',
      });
      return;
    }
      const validationError = validateLogin({
        email: data.email,
        password: data.password,
      });
      if (validationError) {
        setError(validationError);
        notifications.show({
          title: 'Validation error',
          message: validationError,
          color: 'red',
        });
        return;
      }
      setError('');
      setIsLoading(true);
      try {
        const result = await authService.login({
          email: data.email,
          password: data.password,
        });
        authStorage.setAccessToken(result.accessToken);
        authStorage.setUser(result.user);
        if (result.refreshToken) authStorage.setRefreshToken(result.refreshToken);
        notifications.show({
          title: 'Welcome back',
          message: 'Login successful',
          color: 'green',
        });
        navigate('/dashboard');
      } catch (err: any) {
        if (!isMountedRef.current) return;
        const message = err?.message || 'Login failed';
        setError(message);
        notifications.show({
          title: 'Login failed',
          message,
          color: 'red',
        });
      } finally {
        if (!isMountedRef.current) return;
        setIsLoading(false);
      }
    }, [data.email, data.password, navigate]);
  return (
    <PageWrapper className="bg-surface">
      <div className="mx-auto w-full max-w-6xl px-6 relative">
        <motion.div
          className="pointer-events-none absolute -left-8 top-32 h-16 w-16 rounded-full bg-primary/10"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute left-20 top-64 h-8 w-8 rounded-full bg-secondary/20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute right-12 top-24 h-10 w-10 rounded-full bg-primary/10"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute right-32 bottom-32 h-14 w-14 rounded-full bg-secondary/15"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            className="relative flex flex-col items-center lg:items-start"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div
              style={{ y: scatterSlow }}
              className="pointer-events-none absolute -left-6 top-12 h-12 w-12 rounded-full bg-primary/10"
            />
            <motion.div
              style={{ y: scatterFast }}
              className="pointer-events-none absolute left-10 top-44 h-6 w-6 rounded-full bg-secondary/20"
            />
            <motion.div
              style={{ y: scatterOpp }}
              className="pointer-events-none absolute left-28 top-72 h-10 w-10 rounded-full bg-primary/15"
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-md text-center lg:text-left"
            >
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary"
              >
                Secure Access
              </motion.span>
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
            </motion.div>
          </motion.div>
          <div className="flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, x: 18, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full max-w-md rounded-3xl bg-surface-container-lowest p-8 shadow-xl"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-on-surface">Sign In</h2>
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
