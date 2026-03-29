import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../../components/shared/PageWrapper";
import InputField from "../../components/shared/InputField";
import Button from "../../components/shared/Button";
import { authService } from "../../services/auth";
import { forgotFlowStorage } from "../../services/forgotFlowStorage";
import { notifications } from "@mantine/notifications";
import { validateVerifyCode } from "../../utils/validators/authValidators";

const VerifyCodePage = () => {
  const email = forgotFlowStorage.getEmail() || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const isMountedRef = useRef(true);
  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = useCallback(async () => {
    if (!isMountedRef.current) return;
    const validationError = validateVerifyCode({ email, code });
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
      await authService.verifyCode({ email, code });
      forgotFlowStorage.setCode(code);
      notifications.show({
        title: "Code verified",
        message: "You can now reset your password.",
        color: "green",
      });
      navigate("/reset-password");
    } catch (err: any) {
      if (!isMountedRef.current) return;
      const message = err?.message || "Invalid code";
      setError(message);
      notifications.show({
        title: "Verification failed",
        message,
        color: "red",
      });
    } finally {
      if (!isMountedRef.current) return;
      setIsLoading(false);
    }
  }, [code, email, navigate]);

  const handleResend = useCallback(async () => {
    if (!isMountedRef.current) return;
    if (!email) {
      setError("Missing email");
      return;
    }
    setError("");
    setIsResending(true);
    try {
      await authService.forgotPassword({ email });
      notifications.show({
        title: "Code resent",
        message: "Check your email for the new code.",
        color: "green",
      });
    } catch (err: any) {
      const message = err?.message || "Failed to resend code";
      setError(message);
      notifications.show({
        title: "Resend failed",
        message,
        color: "red",
      });
    } finally {
      if (!isMountedRef.current) return;
      setIsResending(false);
    }
  }, [email]);

  return (
    <PageWrapper className="bg-surface">
      <div className="mx-auto w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-20 rounded-3xl bg-surface-container-lowest p-8 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-on-surface">Verify Code</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Enter the verification code sent to {email || "your email"}.
          </p>
          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={async (event) => {
              event.preventDefault();
              await handleSubmit();
            }}
          >
            <InputField
              label="Verification Code"
              name="code"
              value={code}
              onChange={handleCodeChange}
            />
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-red-500">{error}</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-semibold text-primary hover:underline disabled:opacity-60"
              >
                {isResending ? "Resending..." : "Resend code"}
              </button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default VerifyCodePage;
