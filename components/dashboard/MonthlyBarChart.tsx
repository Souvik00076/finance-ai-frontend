"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Loader2 } from "lucide-react";
import { getMonthlyTrend, getIncomeMonthlyTrend, MonthlyTrendItem } from "@/services/analytics";

const INCOME_COLOR = "hsl(152, 60%, 48%)";
const EXPENSE_COLOR = "hsl(0, 72%, 55%)";
const SPEND_ONLY_COLOR = "hsl(168, 80%, 50%)"; // original single-series colour

type MonthRow = { month: string; income: number; expense: number };

export function MonthlyBarChart() {
  const [expense, setExpense] = useState<MonthlyTrendItem[]>([]);
  const [income, setIncome] = useState<MonthlyTrendItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      const [expRes, incRes] = await Promise.allSettled([getMonthlyTrend(), getIncomeMonthlyTrend()]);
      if (expRes.status === "fulfilled" && expRes.value.success) {
        setExpense(expRes.value.data);
      } else if (expRes.status === "rejected") {
        console.error("Failed to fetch monthly trend:", expRes.reason);
        setError(expRes.reason?.message || "Failed to load data");
      }
      if (incRes.status === "fulfilled" && incRes.value.success) {
        setIncome(incRes.value.data);
      } else if (incRes.status === "rejected") {
        // Income is optional; the chart still shows spending.
        console.error("Failed to fetch income monthly trend:", incRes.reason);
      }
      setIsLoading(false);
    };
    fetchAll();
  }, []);

  // Merge both series by month ("YYYY-MM"), ascending.
  const data = useMemo<MonthRow[]>(() => {
    const byMonth = new Map<string, MonthRow>();
    const row = (month: string) => {
      if (!byMonth.has(month)) byMonth.set(month, { month, income: 0, expense: 0 });
      return byMonth.get(month)!;
    };
    expense.forEach((e) => (row(e.month).expense += e.amount));
    income.forEach((e) => (row(e.month).income += e.amount));
    return [...byMonth.values()].sort((a, b) => a.month.localeCompare(b.month));
  }, [expense, income]);

  const hasIncome = income.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="glass-card p-5"
    >
      <h3 className="text-sm font-semibold text-muted-foreground mb-4">Monthly Overview</h3>
      <div className="h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error && data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">No data</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 18%, 10%)",
                  border: "1px solid hsl(220, 14%, 16%)",
                  borderRadius: "8px",
                  fontSize: 13,
                  color: "hsl(210, 20%, 95%)",
                }}
                formatter={(value, name) => [`₹${Number(value).toLocaleString("en-IN")}`, name]}
                labelFormatter={(label, payload) => {
                  const r = payload?.[0]?.payload as MonthRow | undefined;
                  if (!r || !hasIncome) return label;
                  const net = r.income - r.expense;
                  return `${label} · Net ${net < 0 ? "-" : "+"}₹${Math.abs(net).toLocaleString("en-IN")}`;
                }}
              />
              {hasIncome && <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} />}
              {hasIncome && <Bar dataKey="income" name="Income" fill={INCOME_COLOR} radius={[4, 4, 0, 0]} />}
              <Bar dataKey="expense" name="Expense" fill={hasIncome ? EXPENSE_COLOR : SPEND_ONLY_COLOR} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
