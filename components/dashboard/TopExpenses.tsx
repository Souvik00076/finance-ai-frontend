"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { DateRange } from "@/lib/period";
import { useApiData } from "@/lib/useApiData";
import { getTopExpenses, type TopExpenseItem } from "@/services/analytics/explore";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const formatDate = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

export function TopExpenses({ range }: { range: DateRange }) {
  const { data, error, isLoading } = useApiData<TopExpenseItem[]>(
    `top|${range.start}|${range.end}`,
    async () => (await getTopExpenses(range, 5)).data,
    "Failed to load top expenses",
  );
  const items = data ?? [];
  const max = items[0]?.amount ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="glass-card p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">Top Expenses</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Biggest single items · {range.label}</p>
      </div>
      {isLoading && !data ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground py-8 text-center">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No spending in {range.label}</p>
      ) : (
        <ol className="space-y-3">
          {items.map((item, i) => (
            <li key={`${item.id}-${i}`} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-muted-foreground font-mono w-4">{i + 1}</span>
                  <span className="font-medium truncate">{item.name}</span>
                  <span className="text-[10px] text-muted-foreground capitalize whitespace-nowrap hidden sm:inline">
                    {item.category.replace(/_/g, " ")} · {formatDate(item.date)}
                  </span>
                </div>
                <span className="font-semibold font-mono text-expense whitespace-nowrap">
                  ₹{Math.round(item.amount).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="h-1 rounded-full bg-secondary/60 ml-6">
                <div
                  className="h-1 rounded-full bg-expense/70"
                  style={{ width: `${max ? Math.max(4, (item.amount / max) * 100) : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </motion.div>
  );
}
