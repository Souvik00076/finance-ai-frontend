"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { getDailyTrend, DailyTrendItem } from "@/services/analytics";

export function ExpenseChart() {
  const [data, setData] = useState<DailyTrendItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyTrend = async () => {
      try {
        const response = await getDailyTrend();
        if (response.success && response.data) {
          setData(response.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch daily trend:", err);
        setError(err?.message || "Failed to load trend data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyTrend();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-5"
    >
      <h3 className="text-sm font-semibold text-muted-foreground mb-4">Daily Spending Trend</h3>
      <div className="h-[260px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">No spending data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(168, 80%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(168, 80%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (isNaN(date.getTime())) return value;
                  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 18%, 10%)",
                  border: "1px solid hsl(220, 14%, 16%)",
                  borderRadius: "8px",
                  fontSize: 13,
                  color: "hsl(210, 20%, 95%)",
                }}
                formatter={(value) => [`₹${value}`, "Spent"]}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="hsl(168, 80%, 50%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
