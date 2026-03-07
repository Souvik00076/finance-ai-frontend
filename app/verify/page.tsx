"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Wallet,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  Mail,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { verifyEmail } from "@/services/auth";

type VerificationState = "loading" | "success" | "error" | "missing-params";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<VerificationState>("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleVerification = useCallback(async (actionCode: string, email: string) => {
    try {
      console.log("Starting verification with:", { actionCode, email });
      setState("loading");
      const response = await verifyEmail(actionCode, email);

      console.log("Verification response:", response);

      if (response.success) {
        setState("success");
        setMessage(
          response.message || 
          "Your email has been verified successfully! You can now log in to your account."
        );
      } else {
        setState("error");
        setMessage(response.message || "Verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setState("error");
      setMessage(
        error?.message || 
        "Failed to verify your email. The link may have expired or is invalid."
      );
    }
  }, []);

  useEffect(() => {
    const actionCode = searchParams.get("action_code");
    const emailParam = searchParams.get("email");

    console.log("URL params:", { actionCode, emailParam });

    if (!actionCode || !emailParam) {
      console.log("Missing params, showing error");
      setState("missing-params");
      setMessage("Invalid verification link. Please check your email and try again.");
      return;
    }

    setEmail(emailParam);
    handleVerification(actionCode, emailParam);
  }, [searchParams, handleVerification]);

  const handleGoToLogin = () => {
    router.push("/login");
  };

  const handleResendEmail = () => {
    // TODO: Implement resend verification email
    router.push("/login");
  };

  const renderContent = () => {
    switch (state) {
      case "loading":
        return (
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-bold">Verifying Your Email</h2>
            <p className="text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </motion.div>
        );

      case "success":
        return (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Email Verified!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {message}
              </p>
              {email && (
                <p className="text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 inline mr-1" />
                  {email}
                </p>
              )}
            </div>
            <Button
              onClick={handleGoToLogin}
              className="w-full sm:w-auto"
              size="lg"
            >
              Continue to Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        );

      case "error":
        return (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Verification Failed
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {message}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleResendEmail}
                variant="outline"
                size="lg"
              >
                Resend Verification Email
              </Button>
              <Button
                onClick={handleGoToLogin}
                size="lg"
              >
                Go to Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case "missing-params":
        return (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Invalid Link
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {message}
              </p>
            </div>
            <Button
              onClick={handleGoToLogin}
              size="lg"
            >
              Go to Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/home")}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">ExpenseFlow</span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="glass-card p-8 sm:p-12">
            {renderContent()}
          </div>

          {state === "success" && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              Welcome to ExpenseFlow! Start tracking your expenses effortlessly.
            </p>
          )}

          {state === "error" && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              Need help? Contact our support team for assistance.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
