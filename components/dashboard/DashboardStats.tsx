"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  TrendingUp,
  CalendarDays,
  IndianRupee,
  Loader2,
  ArrowDownToLine,
  Scale,
  PiggyBank,
  Landmark,
} from "lucide-react";
import { StatCard } from "./StatCard";
import {
  getStatistics,
  getIncomeStatistics,
  StatisticsData,
  IncomeStatisticsData,
} from "@/services/analytics";

const rupees = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/** % change of `current` vs `previous`; null when there is nothing to compare. */
const percentChange = (current: number, previous: number): number | null => {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
};

export function DashboardStats() {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [income, setIncome] = useState<IncomeStatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      // Income may not be available (e.g. API not deployed yet); spending must still render.
      const [spendRes, incomeRes] = await Promise.allSettled([getStatistics(), getIncomeStatistics()]);
      if (spendRes.status === "fulfilled" && spendRes.value.success) setStats(spendRes.value.data);
      else if (spendRes.status === "rejected") console.error("Failed to fetch statistics:", spendRes.reason);
      if (incomeRes.status === "fulfilled" && incomeRes.value.success) setIncome(incomeRes.value.data);
      else if (incomeRes.status === "rejected") console.error("Failed to fetch income statistics:", incomeRes.reason);
      setIsLoading(false);
    };
    fetchAll();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[0, 1].map((row) => (
          <div key={row} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-5 flex items-center justify-center h-[130px]">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // ── Spending ──
  const weekTrend = stats
    ? percentChange(stats.last_7_days_spend, stats.last_14_days_spend - stats.last_7_days_spend)
    : null;
  const monthTrend = stats
    ? percentChange(stats.last_month_spend, stats.last_2_months_spend - stats.last_month_spend)
    : null;

  // ── Income (this calendar month) ──
  const earnedThisMonth = income?.last_month_earned ?? null;
  const earnedTrend = income
    ? percentChange(income.last_month_earned, income.last_2_months_earned - income.last_month_earned)
    : null;
  const spentThisMonth = stats?.last_month_spend ?? 0;
  const net = earnedThisMonth !== null ? earnedThisMonth - spentThisMonth : null;
  const savingsRate = net !== null && earnedThisMonth ? Math.round((net / earnedThisMonth) * 100) : null;

  const monthLabel = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const netClass = net === null ? "" : net >= 0 ? "text-success" : "text-expense";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today"
          value={rupees(stats?.daily_spend ?? 0)}
          icon={IndianRupee}
          subtitle="Daily spending"
          delay={0}
        />
        <StatCard
          title="This Week"
          value={rupees(stats?.last_7_days_spend ?? 0)}
          icon={CalendarDays}
          subtitle="Last 7 days"
          trend={weekTrend !== null ? { value: weekTrend, label: "vs prev week" } : undefined}
          delay={0.05}
        />
        <StatCard
          title="This Month"
          value={rupees(spentThisMonth)}
          icon={TrendingUp}
          subtitle={monthLabel}
          trend={monthTrend !== null ? { value: monthTrend, label: "vs prev month" } : undefined}
          delay={0.1}
        />
        <StatCard
          title="All Time"
          value={stats?.all_time_spend != null ? rupees(stats.all_time_spend) : "—"}
          icon={Wallet}
          subtitle="Total spent"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Earned"
          value={earnedThisMonth !== null ? rupees(earnedThisMonth) : "—"}
          icon={ArrowDownToLine}
          subtitle={`Income in ${monthLabel}`}
          trend={earnedTrend !== null ? { value: earnedTrend, label: "vs prev month" } : undefined}
          invertTrend
          valueClassName={earnedThisMonth ? "text-success" : ""}
          delay={0.2}
        />
        <StatCard
          title="Net"
          value={net !== null ? `${net < 0 ? "-" : ""}${rupees(Math.abs(net))}` : "—"}
          icon={Scale}
          subtitle="Earned − spent this month"
          valueClassName={netClass}
          delay={0.25}
        />
        <StatCard
          title="Savings Rate"
          value={savingsRate !== null ? `${savingsRate}%` : "—"}
          icon={PiggyBank}
          subtitle={savingsRate !== null ? "Of this month's income" : "No income this month"}
          valueClassName={savingsRate === null ? "" : savingsRate >= 0 ? "text-success" : "text-expense"}
          delay={0.3}
        />
        <StatCard
          title="All Time Earned"
          value={income?.all_time_earned != null ? rupees(income.all_time_earned) : "—"}
          icon={Landmark}
          subtitle="Total income"
          delay={0.35}
        />
      </div>
    </div>
  );
}
