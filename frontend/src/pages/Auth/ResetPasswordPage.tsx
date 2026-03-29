import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../../components/shared/PageWrapper";
import InputField from "../../components/shared/InputField";
import Button from "../../components/shared/Button";
import { authService } from "../../services/auth";
import { forgotFlowStorage } from "../../services/forgotFlowStorage";
import { notifications } from "@mantine/notifications";
import { validateResetPassword } from "../../utils/validators/authValidators";

const ResetPasswordPage = () => {
  const email = forgotFlowStorage.getEmail() || "";
  const code = forgotFlowStorage.getCode() || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isMountedRef = useRef(true);
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
    if (!email || !code) {
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
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
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
