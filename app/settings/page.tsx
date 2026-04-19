"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, User, Phone, LogOut, Loader2, Mail, Shield, Calendar, CheckCircle2, MessageCircle, AlertCircle, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout as logoutApi, getUserSettings, linkWhatsapp, verifyWhatsappOtp, linkTelegram } from "@/services/auth";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";

export default function SettingsPage() {
  const { user, updateProfile, logout, setUserData } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // WhatsApp linking state
  const [isPhoneLinked, setIsPhoneLinked] = useState(false);
  const [canVerify, setCanVerify] = useState(false);
  const [chatNumber, setChatNumber] = useState<string | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [whatsappError, setWhatsappError] = useState("");
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Telegram linking state
  const [isTelegramLinked, setIsTelegramLinked] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState("");
  const [isLinkingTelegram, setIsLinkingTelegram] = useState(false);
  const [telegramError, setTelegramError] = useState("");

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await getUserSettings();
        if (response.success && response.data) {
          setUserData({
            email: response.data.email,
            full_name: response.data.full_name,
            picture: response.data.picture,
            provider: response.data.provider,
            email_verified: response.data.email_verified,
            created_at: response.data.created_at,
            is_phone_linked: response.data.is_phone_linked,
            can_verify: response.data.can_verify,
            chat_number: response.data.chat_number,
            is_telegram_linked: response.data.is_telegram_linked,
            total_spent: response.data.total_spent,
          });

          setName(response.data.full_name || "");
          setAvatarPreview(response.data.picture || "");
          setIsPhoneLinked(response.data.is_phone_linked || false);
          setCanVerify(response.data.can_verify || false);
          setChatNumber(response.data.chat_number || null);
          setIsTelegramLinked(response.data.is_telegram_linked || false);
        }
      } catch (error: any) {
        console.error("Failed to fetch user settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({ name, avatar: avatarPreview });
    showSuccessToast("Profile updated successfully!");
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await logoutApi();

      if (response.success) {
        logout();
        showSuccessToast("Logged out successfully!");
        router.push("/home");
      }
    } catch (error: any) {
      showErrorToast(error?.message || "Failed to logout. Please try again.");
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Must start with + followed by country code and number (min 10 digits total)
    const phoneRegex = /^\+[1-9]\d{9,14}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOtp = async () => {
    setWhatsappError("");

    if (!whatsappNumber.trim()) {
      setWhatsappError("Please enter your WhatsApp number");
      return;
    }

    if (!whatsappNumber.startsWith("+")) {
      setWhatsappError("Number must start with country code (e.g., +91)");
      return;
    }

    if (!validatePhoneNumber(whatsappNumber)) {
      setWhatsappError("Please enter a valid phone number with country code (e.g., +919876543210)");
      return;
    }

    setIsSendingOtp(true);

    try {
      const response = await linkWhatsapp(whatsappNumber);
      if (response.success) {
        setOtpSent(true);
        showSuccessToast("OTP sent to your WhatsApp number!");
      }
    } catch (error: any) {
      showErrorToast(error?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = useCallback(async (otpValue: string) => {
    setIsVerifyingOtp(true);

    try {
      const response = await verifyWhatsappOtp(whatsappNumber, otpValue);
      if (response.success) {
        setIsPhoneLinked(true);
        setUserData({ ...user, is_phone_linked: true });
        showSuccessToast("WhatsApp number verified successfully!");
        setOtpSent(false);
        setOtp(["", "", "", "", "", ""]);
        setWhatsappNumber("");
      }
    } catch (error: any) {
      showErrorToast(error?.message || "OTP verification failed. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } finally {
      setIsVerifyingOtp(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whatsappNumber, user]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input on entering a digit
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are filled
    const fullOtp = newOtp.join("");
    if (fullOtp.length === 6 && newOtp.every((d) => d !== "")) {
      handleVerifyOtp(fullOtp);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleLinkTelegram = async () => {
    setTelegramError("");

    if (!telegramChatId.trim()) {
      setTelegramError("Please enter your Telegram Chat ID");
      return;
    }

    setIsLinkingTelegram(true);

    try {
      const response = await linkTelegram(telegramChatId.trim());
      if (response.success) {
        setIsTelegramLinked(true);
        setUserData({ ...user, is_telegram_linked: true });
        showSuccessToast("Telegram linked successfully!");
        setTelegramChatId("");
      }
    } catch (error: any) {
      showErrorToast(error?.message || "Failed to link Telegram. Please try again.");
    } finally {
      setIsLinkingTelegram(false);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      otpInputRefs.current[5]?.focus();
      handleVerifyOtp(pastedData);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-xl sticky top-0 z-10 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your profile and preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Profile */}
          <div className="space-y-6">

          {/* Avatar */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium mb-4">Profile Photo</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {name ? name[0]?.toUpperCase() : <User className="w-8 h-8" />}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div className="text-sm text-muted-foreground">
                Click the camera icon to upload a photo.
                <br />
                JPG, PNG or GIF. Max 2MB.
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-medium">Profile Details</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{user?.email}</span>
                {user?.email_verified && (
                  <div className="ml-auto" title="Email verified">
                    <Shield className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{user?.phone || "Not added"}</span>
              </div>
            </div>
            {user?.provider && (
              <div className="space-y-2">
                <Label>Sign-in Provider</Label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm text-muted-foreground">
                  <span className="capitalize">{user.provider}</span>
                </div>
              </div>
            )}
            {user?.created_at && (
              <div className="space-y-2">
                <Label>Member Since</Label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            )}
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </div>

          {/* Theme */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Theme</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Toggle between light and dark mode</p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </>
            )}
          </Button>

          </div>

          {/* Right Column - Integrations */}
          <div className="space-y-6">

          {/* WhatsApp Linking */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-green-500" />
              <h3 className="text-sm font-medium">WhatsApp Integration</h3>
            </div>

            {isPhoneLinked ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                      WhatsApp Verified
                    </p>
                    <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-0.5">
                      Your WhatsApp number is linked and verified.
                    </p>
                  </div>
                </div>
                {chatNumber && (
                  <button
                    onClick={() => {
                      const cleanNumber = chatNumber.replace(/\D/g, '');
                      window.open(`https://wa.me/${cleanNumber}`, '_blank');
                    }}
                    className="w-full flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors group"
                  >
                    <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <p className="text-xs font-medium text-muted-foreground">
                        Send expenses to:
                      </p>
                      <p className="text-sm font-semibold text-foreground mt-0.5 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {chatNumber}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                  </button>
                )}
              </motion.div>
            ) : canVerify ? (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Link your WhatsApp number to receive notifications and manage expenses via chat.
                </p>

                {!otpSent ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-number">WhatsApp Number</Label>
                      <Input
                        id="whatsapp-number"
                        type="tel"
                        placeholder="+919876543210"
                        value={whatsappNumber}
                        onChange={(e) => {
                          setWhatsappNumber(e.target.value);
                          setWhatsappError("");
                        }}
                        className={whatsappError ? "border-destructive" : ""}
                      />
                      <p className="text-xs text-muted-foreground">
                        Include your country code (e.g., +91 for India, +1 for US)
                      </p>
                      {whatsappError && (
                        <p className="text-xs text-destructive">{whatsappError}</p>
                      )}
                    </div>
                    <Button
                      onClick={handleSendOtp}
                      disabled={isSendingOtp || !whatsappNumber.trim()}
                      className="w-full"
                    >
                      {isSendingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          <Phone className="w-4 h-4 mr-2" />
                          Verify
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-3 rounded-lg bg-secondary text-sm text-center">
                      <p className="text-muted-foreground">
                        OTP sent to <span className="font-medium text-foreground">{whatsappNumber}</span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Enter 6-digit OTP</Label>
                      <div className="flex items-center justify-center gap-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => {
                              otpInputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={index === 0 ? handleOtpPaste : undefined}
                            disabled={isVerifyingOtp}
                            className="w-10 h-12 text-center text-lg font-semibold rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-50"
                          />
                        ))}
                      </div>
                    </div>

                    {isVerifyingOtp && (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying...
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  WhatsApp verification is not available at this time.
                </p>
              </div>
            )}
          </div>

          {/* Telegram Integration */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Send className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-medium">Telegram Integration</h3>
            </div>

            {isTelegramLinked ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Telegram Connected
                    </p>
                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-0.5">
                      Your Telegram account is linked. You can send expenses via the bot.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-2">
                  <p className="text-xs font-medium text-foreground">How to connect:</p>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>
                      Open the Spendly bot on Telegram:{" "}
                      <a
                        href="https://t.me/spendly_by_souvik_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline font-medium"
                      >
                        t.me/spendly_by_souvik_bot
                      </a>
                    </li>
                    <li>Send <span className="font-medium text-foreground">/start</span> to the bot</li>
                    <li>Copy the Chat ID you receive</li>
                    <li>Paste the Chat ID below and submit</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telegram-chat-id">Telegram Chat ID</Label>
                  <Input
                    id="telegram-chat-id"
                    type="text"
                    placeholder="Enter your Chat ID"
                    value={telegramChatId}
                    onChange={(e) => {
                      setTelegramChatId(e.target.value);
                      setTelegramError("");
                    }}
                    className={telegramError ? "border-destructive" : ""}
                  />
                  {telegramError && (
                    <p className="text-xs text-destructive">{telegramError}</p>
                  )}
                </div>
                <Button
                  onClick={handleLinkTelegram}
                  disabled={isLinkingTelegram || !telegramChatId.trim()}
                  className="w-full"
                >
                  {isLinkingTelegram ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Connect Telegram
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
