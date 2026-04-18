"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { getMonthlyTrend, MonthlyTrendItem } from "@/services/analytics";

export function MonthlyBarChart() {
  const [data, setData] = useState<MonthlyTrendItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyTrend = async () => {
      try {
        const response = await getMonthlyTrend();
        if (response.success && response.data) {
          setData(response.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch monthly trend:", err);
        setError(err?.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlyTrend();
  }, []);

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
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">No data</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Total"]}
              />
              <Bar dataKey="amount" fill="hsl(168, 80%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}