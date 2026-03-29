import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import PageWrapper from '../../components/shared/PageWrapper'
import RegisterForm from '../../module/auth/RegisterForm'
import { authService } from '../../services/auth'
import { authStorage } from '../../services/authStorage'
import { useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { validateRegister, validateRegisterFields } from '../../utils/validators/authValidators'
import type { RegisterFieldErrors } from '../../utils/validators/authValidators'

const RegisterPage = () => {
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const navigate = useNavigate();
  const isMountedRef = useRef(true);
  const fullName = useMemo(
    () => `${data.firstName} ${data.lastName}`.trim(),
    [data.firstName, data.lastName]
  );
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

  const handleFirstNameChange = useCallback((value: string) => {
    setData((prev) => ({ ...prev, firstName: value }));
  }, []);

  const handleLastNameChange = useCallback((value: string) => {
    setData((prev) => ({ ...prev, lastName: value }));
  }, []);

  const handleEmailChange = useCallback((value: string) => {
    setData((prev) => ({ ...prev, email: value }));
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setData((prev) => ({ ...prev, password: value }));
  }, []);

  const handleConfirmPasswordChange = useCallback((value: string) => {
    setData((prev) => ({ ...prev, confirmPassword: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isMountedRef.current) return;
    const fieldValidation = validateRegisterFields({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    const hasFieldErrors = Object.values(fieldValidation).some(Boolean);
    setFieldErrors(fieldValidation);
    if (hasFieldErrors) {
      const firstError =
        fieldValidation.firstName ||
        fieldValidation.lastName ||
        fieldValidation.email ||
        fieldValidation.password ||
        fieldValidation.confirmPassword ||
        'Please fix the highlighted fields.';
      setError('Please fix the highlighted fields.');
      notifications.show({
        title: 'Validation error',
        message: firstError,
        color: 'red',
      });
      return;
    }
    const validationError = validateRegister({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
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
      const result = await authService.register({
        fullName,
        email: data.email,
        password: data.password,
        role: 'user',
      });
      authStorage.setAccessToken(result.accessToken);
      authStorage.setUser(result.user);
      notifications.show({
        title: 'Account created',
        message: 'Registration successful',
        color: 'green',
      });
      navigate('/dashboard');
    } catch (err: any) {
      if (!isMountedRef.current) return;
      const message = err?.message || 'Registration failed';
      setError(message);
      notifications.show({
        title: 'Registration failed',
        message,
        color: 'red',
      });
    } finally {
      if (!isMountedRef.current) return;
      setIsLoading(false);
    }
  }, [
    data.password,
    data.confirmPassword,
    data.email,
    fullName,
    navigate,
  ]);
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
          className='left flex flex-col items-center lg:items-start relative'
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
              Elevate Your Research
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
              className="mt-4 text-4xl font-extrabold leading-tight text-on-surface"
            >
              Begin your journey with{' '}
              <span className="text-primary">Intellectual Excellence</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45, ease: 'easeOut' }}
              className="mt-4 text-sm leading-relaxed text-on-surface-variant"
            >
              Join a community of scholars leveraging advanced supervisor agents to curate,
              synthesize, and master complex knowledge.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.45, ease: 'easeOut' }}
              className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <div className="rounded-2xl bg-surface-container-low p-4 text-center sm:text-left shadow-sm">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary sm:mx-0">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <path d="M12 3a7 7 0 0 0-7 7v4.2l-1.6 1.6A1 1 0 0 0 4.1 18h15.8a1 1 0 0 0 .7-1.7L19 14.2V10a7 7 0 0 0-7-7Zm-2 16a2 2 0 0 0 4 0h-4Z" />
                  </svg>
                </div>
                <h3 className="mt-3 text-base font-bold text-on-surface">Smart Curation</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Automated literature reviews and knowledge mapping.
                </p>
              </div>
              <div className="rounded-2xl bg-surface-container-low p-4 text-center sm:text-left shadow-sm">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary sm:mx-0">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <path d="M12 4a8 8 0 1 0 8 8 8.01 8.01 0 0 0-8-8Zm0 3a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 12 7Zm2 10h-4v-1.5h1v-3h-1V11h3v4.5h1Z" />
                  </svg>
                </div>
                <h3 className="mt-3 text-base font-bold text-on-surface">Agent Logic</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Deep contextual understanding of your academic goals.
                </p>
              </div>
            </motion.div>
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
              <h2 className="text-2xl font-bold text-on-surface">Create Account</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Enter your details and let us know about your research.
              </p>
            </div>
            <RegisterForm
              {...data}
              onFirstNameChange={handleFirstNameChange}
              onLastNameChange={handleLastNameChange}
              onEmailChange={handleEmailChange}
              onPasswordChange={handlePasswordChange}
              onConfirmPasswordChange={handleConfirmPasswordChange}
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

export default RegisterPage
