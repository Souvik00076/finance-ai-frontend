"use client";

import { Wallet, TrendingUp, CalendarDays, IndianRupee } from "lucide-react";
import { StatCard } from "./StatCard";
import { getTodayTotal, getWeekTotal, getMonthTotal, expenses } from "@/lib/mockData";

export function DashboardStats() {
  const todayTotal = getTodayTotal();
  const weekTotal = getWeekTotal();
  const monthTotal = getMonthTotal();
  const totalAll = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Today"
        value={`₹${Math.round(todayTotal).toLocaleString()}`}
        icon={IndianRupee}
        subtitle="Daily spending"
        delay={0}
      />
      <StatCard
        title="This Week"
        value={`₹${Math.round(weekTotal).toLocaleString()}`}
        icon={CalendarDays}
        subtitle="Last 7 days"
        trend={{ value: 12, label: "vs last week" }}
        delay={0.05}
      />
      <StatCard
        title="This Month"
        value={`₹${Math.round(monthTotal).toLocaleString()}`}
        icon={TrendingUp}
        subtitle={new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        trend={{ value: -5, label: "vs last month" }}
        delay={0.1}
      />
      <StatCard
        title="All Time"
        value={`₹${Math.round(totalAll).toLocaleString()}`}
        icon={Wallet}
        subtitle={`${expenses.length} transactions`}
        delay={0.15}
      />
    </div>
  );
}
