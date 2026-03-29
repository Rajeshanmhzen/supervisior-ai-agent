const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string) => {
  if (!email.trim()) return "Email is required";
  if (!emailRegex.test(email)) return "Enter a valid email address";
  return null;
};

export const validatePassword = (password: string) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
};

export const validateLogin = (payload: { email: string; password: string }) => {
  const emailError = validateEmail(payload.email);
  if (emailError) return emailError;
  const passError = validatePassword(payload.password);
  if (passError) return passError;
  return null;
};

export type LoginFieldErrors = {
  email?: string;
  password?: string;
};

export const validateLoginFields = (payload: { email: string; password: string }) => {
  const errors: LoginFieldErrors = {};
  const emailError = validateEmail(payload.email);
  if (emailError) errors.email = emailError;
  const passError = validatePassword(payload.password);
  if (passError) errors.password = passError;
  return errors;
};

export const validateRegister = (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  if (!payload.firstName.trim()) return "First name is required";
  if (!payload.lastName.trim()) return "Last name is required";
  const emailError = validateEmail(payload.email);
  if (emailError) return emailError;
  const passError = validatePassword(payload.password);
  if (passError) return passError;
  if (payload.password !== payload.confirmPassword) return "Passwords do not match";
  return null;
};

export type RegisterFieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export const validateRegisterFields = (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const errors: RegisterFieldErrors = {};
  if (!payload.firstName.trim()) errors.firstName = "First name is required";
  if (!payload.lastName.trim()) errors.lastName = "Last name is required";
  const emailError = validateEmail(payload.email);
  if (emailError) errors.email = emailError;
  const passError = validatePassword(payload.password);
  if (passError) errors.password = passError;
  if (payload.password !== payload.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
};

export const validateForgotPassword = (payload: { email: string }) => {
  return validateEmail(payload.email);
};

export const validateVerifyCode = (payload: { email: string; code: string }) => {
  const emailError = validateEmail(payload.email);
  if (emailError) return emailError;
  if (!payload.code.trim()) return "Verification code is required";
  return null;
};

export const validateResetPassword = (payload: {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}) => {
  const emailError = validateEmail(payload.email);
  if (emailError) return emailError;
  if (!payload.code.trim()) return "Verification code is required";
  const passError = validatePassword(payload.password);
  if (passError) return passError;
  if (payload.password !== payload.confirmPassword) return "Passwords do not match";
  return null;
};
