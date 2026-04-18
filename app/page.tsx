"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Send, ArrowRight, X } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { RecentExpenses } from "@/components/dashboard/RecentExpenses";
import { MonthlyBarChart } from "@/components/dashboard/MonthlyBarChart";
import { getUserSettings } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function DashboardPage() {
  const router = useRouter();
  const { user, setUserData } = useAuth();
  const [showLinkDialog, setShowLinkDialog] = useState(false);

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
            is_telegram_linked: response.data.is_telegram_linked,
            total_spent: response.data.total_spent,
          });

          // Show dialog if neither is linked
          if (!response.data.is_phone_linked && !response.data.is_telegram_linked) {
            setShowLinkDialog(true);
          }
        }
      } catch (error: any) {
        console.error("Failed to fetch user settings:", error);
      }
    };

    fetchUserSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 custom-scrollbar">
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ExpenseChart />
          </div>
          <CategoryBreakdown />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentExpenses />
          <MonthlyBarChart />
        </div>
      </main>

      {/* Link WhatsApp / Telegram Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Connect a Messaging Platform</DialogTitle>
            <DialogDescription>
              Link WhatsApp or Telegram to start tracking your expenses by simply sending a message.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* WhatsApp */}
            <div className="p-4 rounded-lg border border-border bg-secondary/30 space-y-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <h4 className="text-sm font-semibold">WhatsApp</h4>
              </div>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Go to <span className="font-medium text-foreground">Settings</span></li>
                <li>Enter your WhatsApp number with country code</li>
                <li>Verify with the OTP sent to your WhatsApp</li>
              </ol>
            </div>

            {/* Telegram */}
            <div className="p-4 rounded-lg border border-border bg-secondary/30 space-y-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-500" />
                <h4 className="text-sm font-semibold">Telegram</h4>
              </div>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>
                  Open{" "}
                  <a
                    href="https://t.me/spendly_by_souvik_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline font-medium"
                  >
                    t.me/spendly_by_souvik_bot
                  </a>
                </li>
                <li>Send <span className="font-medium text-foreground">Spendly</span> to the bot</li>
                <li>Copy the Chat ID and paste it in <span className="font-medium text-foreground">Settings</span></li>
              </ol>
            </div>

            <Button
              onClick={() => {
                setShowLinkDialog(false);
                router.push("/settings");
              }}
              className="w-full"
            >
              Go to Settings
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
