import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../../components/shared/PageWrapper";
import InputField from "../../components/shared/InputField";
import Button from "../../components/shared/Button";
import { authService } from "../../services/auth";
import { forgotFlowStorage } from "../../services/forgotFlowStorage";
import { notifications } from "@mantine/notifications";
import { validateForgotPassword } from "../../utils/validators/authValidators";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isMountedRef = useRef(true);
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isMountedRef.current) return;
    const validationError = validateForgotPassword({ email });
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
      await authService.forgotPassword({ email });
      forgotFlowStorage.setEmail(email);
      forgotFlowStorage.setCode("");
      notifications.show({
        title: "Code sent",
        message: "Check your email for the verification code.",
        color: "green",
      });
      navigate("/verify-code");
    } catch (err: any) {
      if (!isMountedRef.current) return;
      const message = err?.message || "Failed to send code";
      setError(message);
      notifications.show({
        title: "Request failed",
        message,
        color: "red",
      });
    } finally {
      if (!isMountedRef.current) return;
      setIsLoading(false);
    }
  }, [email, navigate]);

  return (
    <PageWrapper className="bg-surface">
      <div className="mx-auto w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-20 rounded-3xl bg-surface-container-lowest p-8 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-on-surface">Forgot Password</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Enter your email and we will send you a verification code.
          </p>
          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={async (event) => {
              event.preventDefault();
              await handleSubmit();
            }}
          >
            <InputField label="Email" name="email" value={email} onChange={handleEmailChange} />
            <span className="text-[10px] text-red-500">{error}</span>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Code"}
            </Button>
          </form>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default ForgotPasswordPage;
