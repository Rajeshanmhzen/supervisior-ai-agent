import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../../components/shared/PageWrapper";
import InputField from "../../components/shared/InputField";
import Button from "../../components/shared/Button";
import AnimatedButton from "../../components/shared/AnimatedButton";
import { authService } from "../../services/auth";
import { forgotFlowStorage } from "../../services/forgotFlowStorage";
import { notifications } from "@mantine/notifications";
import { validateResetPassword } from "../../utils/validators/authValidators";

const ResetPasswordPage = () => {
  const email = forgotFlowStorage.getEmail() || "";
  const code = forgotFlowStorage.getCode() || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isMountedRef = useRef(true);
  const hasReset = useRef(false);
  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
  }, []);
  const handleConfirmPasswordChange = useCallback((value: string) => {
    setConfirmPassword(value);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!hasReset.current && (!email || !code)) {
      navigate("/forgot-password");
    }
  }, [email, code, navigate]);

  const handleSubmit = useCallback(async () => {
    if (!isMountedRef.current) return;
    const validationError = validateResetPassword({
      email,
      code,
      password,
      confirmPassword,
    });
    if (validationError) {
      setError(validationError);
      notifications.show({
        title: "Validation error",
        message: validationError,
        color: "red",
      });
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      if (!email || !code) {
        throw new Error("Missing verification details");
      }
      await authService.resetPassword({ email, code, password });
      hasReset.current = true;
      forgotFlowStorage.clear();
      notifications.show({
        title: "Password updated",
        message: "You can now sign in with the new password.",
        color: "green",
      });
      navigate("/login");
    } catch (err: any) {
      if (!isMountedRef.current) return;
      const message = err?.message || "Reset failed";
      setError(message);
      notifications.show({
        title: "Reset failed",
        message,
        color: "red",
      });
    } finally {
      if (!isMountedRef.current) return;
      setIsLoading(false);
    }
  }, [code, confirmPassword, email, navigate, password]);

  return (
    <PageWrapper className="bg-surface">
      <div className="mx-auto w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-20 rounded-3xl bg-surface-container-lowest p-8 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-on-surface">Reset Password</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Set a new password for {email || "your account"}.
          </p>
          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={async (event) => {
              event.preventDefault();
              await handleSubmit();
            }}
          >
            <InputField
              label="New Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              rightAdornment={
                <AnimatedButton
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className={`text-on-surface-variant transition-all duration-200 ease-out ${password && password.length > 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
                  rippleColor="bg-primary/10"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c5.5 0 9.6 3.6 11 8-0.5 1.6-1.4 3-2.5 4.1" />
                      <path d="M6.1 6.1C4 7.6 2.5 9.7 2 12c1.4 4.4 5.5 8 10 8 1.2 0 2.3-0.2 3.4-0.6" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1.9 12C3.3 7.6 7.4 4 12 4s8.7 3.6 10.1 8c-1.4 4.4-5.5 8-10.1 8S3.3 16.4 1.9 12Z" />
                      <circle cx="12" cy="12" r="3.5" />
                    </svg>
                  )}
                </AnimatedButton>
              }
            />
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              rightAdornment={
                <AnimatedButton
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className={`text-on-surface-variant transition-all duration-200 ease-out ${confirmPassword && confirmPassword.length > 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
                  rippleColor="bg-primary/10"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c5.5 0 9.6 3.6 11 8-0.5 1.6-1.4 3-2.5 4.1" />
                      <path d="M6.1 6.1C4 7.6 2.5 9.7 2 12c1.4 4.4 5.5 8 10 8 1.2 0 2.3-0.2 3.4-0.6" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1.9 12C3.3 7.6 7.4 4 12 4s8.7 3.6 10.1 8c-1.4 4.4-5.5 8-10.1 8S3.3 16.4 1.9 12Z" />
                      <circle cx="12" cy="12" r="3.5" />
                    </svg>
                  )}
                </AnimatedButton>
              }
            />
            <span className="text-[10px] text-red-500">{error}</span>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Reset Password"}
            </Button>
          </form>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default ResetPasswordPage;
