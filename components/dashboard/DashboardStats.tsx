"use client";

import { useState, useEffect } from "react";
import { Wallet, TrendingUp, CalendarDays, IndianRupee, Loader2 } from "lucide-react";
import { StatCard } from "./StatCard";
import { getStatistics, StatisticsData } from "@/services/analytics";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getStatistics();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch statistics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Calculate week-over-week percentage change
  // last_7 vs (last_14 - last_7) = previous week
  const getWeekTrend = (): number | null => {
    if (!stats) return null;
    const currentWeek = stats.last_7_days_spend;
    const previousWeek = stats.last_14_days_spend - stats.last_7_days_spend;
    if (previousWeek === 0) return currentWeek > 0 ? 100 : 0;
    return Math.round(((currentWeek - previousWeek) / previousWeek) * 100);
  };

  // Calculate month-over-month percentage change
  // last_month vs (last_2_months - last_month) = previous month
  const getMonthTrend = (): number | null => {
    if (!stats) return null;
    const currentMonth = stats.last_month_spend;
    const previousMonth = stats.last_2_months_spend - stats.last_month_spend;
    if (previousMonth === 0) return currentMonth > 0 ? 100 : 0;
    return Math.round(((currentMonth - previousMonth) / previousMonth) * 100);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-5 flex items-center justify-center h-[130px]">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ))}
      </div>
    );
  }

  const weekTrend = getWeekTrend();
  const monthTrend = getMonthTrend();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Today"
        value={`₹${(stats?.daily_spend ?? 0).toLocaleString()}`}
        icon={IndianRupee}
        subtitle="Daily spending"
        delay={0}
      />
      <StatCard
        title="This Week"
        value={`₹${(stats?.last_7_days_spend ?? 0).toLocaleString()}`}
        icon={CalendarDays}
        subtitle="Last 7 days"
        trend={weekTrend !== null ? { value: weekTrend, label: "vs prev week" } : undefined}
        delay={0.05}
      />
      <StatCard
        title="This Month"
        value={`₹${(stats?.last_month_spend ?? 0).toLocaleString()}`}
        icon={TrendingUp}
        subtitle={new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        trend={monthTrend !== null ? { value: monthTrend, label: "vs prev month" } : undefined}
        delay={0.1}
      />
      <StatCard
        title="All Time"
        value={`₹${(user?.total_spent ?? 0).toLocaleString()}`}
        icon={Wallet}
        subtitle="Total spent"
        delay={0.15}
      />
    </div>
  );
}
