"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Wallet, Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleSendOTP = () => {
    if (phone.length >= 10) {
      // TODO: Call API to send OTP via Twilio WhatsApp
      setStep("otp");
    }
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      // TODO: Call API to verify OTP and login
      router.push("/dashboard");
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
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">Spendly</span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="glass-card p-8 space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">
                {step === "phone" ? "Login with Phone" : "Verify OTP"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {step === "phone"
                  ? "Enter your phone number to continue"
                  : `We sent a code to +91 ${phone}`}
              </p>
            </div>

            {step === "phone" ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex items-center px-3 rounded-lg bg-secondary text-sm text-muted-foreground border border-border/50">
                    +91
                  </div>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="flex-1"
                    maxLength={10}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleSendOTP}
                  disabled={phone.length < 10}
                >
                  Send OTP
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button
                  className="w-full"
                  onClick={handleVerify}
                  disabled={otp.length < 6}
                >
                  Verify & Login
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <button
                  onClick={() => { setStep("phone"); setOtp(""); }}
                  className="text-sm text-muted-foreground hover:text-foreground w-full text-center transition-colors"
                >
                  Change phone number
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            By logging in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
