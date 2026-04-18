"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";
import { getCategoryBreakdown, CategoryBreakdownItem } from "@/services/analytics";

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

export function CategoryBreakdown() {
  const [data, setData] = useState<CategoryBreakdownItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryBreakdown = async () => {
      try {
        const response = await getCategoryBreakdown();
        if (response.success && response.data) {
          setData(response.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch category breakdown:", err);
        setError(err?.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryBreakdown();
  }, []);

  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-5"
    >
      <h3 className="text-sm font-semibold text-muted-foreground mb-4">Category Breakdown</h3>
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
            <div className="flex items-center justify-center h-full">
              <p className="text-xs text-muted-foreground">No data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="amount">
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
                  formatter={(value) => [`₹${value}`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="flex-1 space-y-2">
          {isLoading || error || data.length === 0 ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            data.slice(0, 5).map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-secondary-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium font-mono text-xs">₹{item.amount.toLocaleString()}</span>
                  <span className="text-muted-foreground text-xs">{Math.round((item.amount / total) * 100)}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}