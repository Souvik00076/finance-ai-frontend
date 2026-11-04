"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";
import {
  getCategoryBreakdown,
  getIncomeCategoryBreakdown,
  CategoryBreakdownItem,
} from "@/services/analytics";

const COLORS = [
  "hsl(168, 80%, 50%)",
  "hsl(200, 70%, 55%)",
  "hsl(38, 92%, 55%)",
  "hsl(280, 60%, 60%)",
  "hsl(0, 72%, 55%)",
  "hsl(152, 60%, 48%)",
  "hsl(320, 60%, 55%)",
  "hsl(45, 80%, 55%)",
];

type View = "spending" | "income";

const formatCategoryName = (category: string) => category.replace(/_/g, " ");

export function CategoryBreakdown() {
  const [view, setView] = useState<View>("spending");
  const [spending, setSpending] = useState<CategoryBreakdownItem[]>([]);
  const [income, setIncome] = useState<CategoryBreakdownItem[]>([]);
  const [spendingError, setSpendingError] = useState<string | null>(null);
  const [incomeError, setIncomeError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [spendRes, incRes] = await Promise.allSettled([getCategoryBreakdown(), getIncomeCategoryBreakdown()]);
      if (spendRes.status === "fulfilled" && spendRes.value.success) setSpending(spendRes.value.data);
      else if (spendRes.status === "rejected") {
        console.error("Failed to fetch category breakdown:", spendRes.reason);
        setSpendingError(spendRes.reason?.message || "Failed to load data");
      }
      if (incRes.status === "fulfilled" && incRes.value.success) setIncome(incRes.value.data);
      else if (incRes.status === "rejected") {
        console.error("Failed to fetch income breakdown:", incRes.reason);
        setIncomeError("Income data is not available yet");
      }
      setIsLoading(false);
    };
    fetchAll();
  }, []);

  const data = view === "spending" ? spending : income;
  const error = view === "spending" ? spendingError : incomeError;
  const total = data.reduce((s, d) => s + d.amount, 0);
  const emptyText = view === "income" ? "No income in the last 30 days" : "No data";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4 gap-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Category Breakdown</h3>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/60" role="tablist">
          {(["spending", "income"] as View[]).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={`text-xs px-2.5 py-1 rounded-md capitalize transition-colors ${
                view === v
                  ? "bg-background text-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <div className="w-[140px] h-[140px] flex-shrink-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-center">
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <p className="text-xs text-muted-foreground">{emptyText}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="amount" nameKey="name">
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(220, 18%, 10%)",
                    border: "1px solid hsl(220, 14%, 16%)",
                    borderRadius: "8px",
                    fontSize: 12,
                    color: "hsl(210, 20%, 95%)",
                  }}
                  formatter={(value, name) => [`₹${Number(value).toLocaleString("en-IN")}`, formatCategoryName(String(name))]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="flex-1 space-y-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : error || data.length === 0 ? null : (
            data.slice(0, 5).map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-secondary-foreground capitalize">{formatCategoryName(item.name)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium font-mono text-xs">₹{item.amount.toLocaleString("en-IN")}</span>
                  <span className="text-muted-foreground text-xs">
                    {total ? Math.round((item.amount / total) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
