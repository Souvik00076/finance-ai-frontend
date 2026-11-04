"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";
import type { DateRange } from "@/lib/period";
import { useApiData } from "@/lib/useApiData";
import { getBreakdown, type BreakdownItem, type Kind } from "@/services/analytics/explore";

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

const formatCategoryName = (category: string) => category.replace(/_/g, " ");

export function CategoryBreakdown({ range }: { range: DateRange }) {
  const [kind, setKind] = useState<Kind>("expense");
  const { data, error, isLoading } = useApiData<BreakdownItem[]>(
    `${kind}|${range.start}|${range.end}`,
    async () => (await getBreakdown(kind, range)).data,
    kind === "income" ? "Income data is not available yet" : "Failed to load data",
  );

  const items = data ?? [];
  const total = items.reduce((s, d) => s + d.amount, 0);
  const emptyText = kind === "income" ? `No income in ${range.label}` : `No spending in ${range.label}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-5 h-full"
    >
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-muted-foreground">Category Breakdown</h3>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{range.label}</p>
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/60" role="tablist">
          {(["expense", "income"] as Kind[]).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={kind === k}
              onClick={() => setKind(k)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                kind === k ? "bg-background text-foreground shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {k === "expense" ? "Spending" : "Income"}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-[140px] h-[140px] flex-shrink-0">
          {isLoading && !data ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-center">
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <p className="text-xs text-muted-foreground">{emptyText}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={items} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="amount" nameKey="name">
                  {items.map((_, i) => (
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
                  formatter={(value, name) => [`₹${Math.round(Number(value)).toLocaleString("en-IN")}`, formatCategoryName(String(name))]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="w-full sm:flex-1 space-y-2 min-w-0">
          {!error &&
            items.slice(0, 5).map((item, i) => (
              <div key={item.name} className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-secondary-foreground capitalize truncate">{formatCategoryName(item.name)}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-medium font-mono text-xs">₹{Math.round(item.amount).toLocaleString("en-IN")}</span>
                  <span className="text-muted-foreground text-xs w-8 text-right">
                    {total ? Math.round((item.amount / total) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          {!error && items.length > 5 && (
            <p className="text-xs text-muted-foreground">+{items.length - 5} more</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
