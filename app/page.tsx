"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { RecentExpenses } from "@/components/dashboard/RecentExpenses";
import { MonthlyBarChart } from "@/components/dashboard/MonthlyBarChart";
import { getUserSettings } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { setUserData } = useAuth();

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await getUserSettings();
        if (response.success && response.data) {
          // Update user data in context
          setUserData({
            email: response.data.email,
            full_name: response.data.full_name,
            picture: response.data.picture,
            provider: response.data.provider,
            email_verified: response.data.email_verified,
            created_at: response.data.created_at,
          });
        }
      } catch (error: any) {
        // Check if the error is unauthorized
        if (error?.status === 401 || error?.message === "Unauthorized") {
          // Redirect to landing page
          router.push("/home");
        }
        // Silently fail for other errors (like CORS) - don't break the app
        console.error("Failed to fetch user settings:", error);
      }
    };

    fetchUserSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader />

      {/* Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <DashboardStats />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ExpenseChart />
          </div>
          <CategoryBreakdown />
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentExpenses />
          <MonthlyBarChart />
        </div>
      </main>
    </div>
  );
}
