"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { getRecentExpenses, RecentExpenseItem } from "@/services/analytics";

const categoryColors = [
  { bg: "rgb(34 197 94 / 0.2)", text: "rgb(34 197 94)", border: "rgb(34 197 94)" },
  { bg: "rgb(59 130 246 / 0.2)", text: "rgb(59 130 246)", border: "rgb(59 130 246)" },
  { bg: "rgb(249 115 22 / 0.2)", text: "rgb(249 115 22)", border: "rgb(249 115 22)" },
  { bg: "rgb(168 85 247 / 0.2)", text: "rgb(168 85 247)", border: "rgb(168 85 247)" },
  { bg: "rgb(239 68 68 / 0.2)", text: "rgb(239 68 68)", border: "rgb(239 68 68)" },
  { bg: "rgb(20 184 166 / 0.2)", text: "rgb(20 184 166)", border: "rgb(20 184 166)" },
  { bg: "rgb(251 191 36 / 0.2)", text: "rgb(251 191 36)", border: "rgb(251 191 36)" },
  { bg: "rgb(236 72 153 / 0.2)", text: "rgb(236 72 153)", border: "rgb(236 72 153)" },
];

const getCategoryColor = (category: string) => {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return categoryColors[Math.abs(hash) % categoryColors.length];
};

const formatCategoryName = (category: string) => {
  return category.replace(/_/g, " ");
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 2) + "..";
};

const sourceColors = {
  whatsapp: { bg: "rgb(37 211 102 / 0.2)", text: "rgb(37 211 102)", border: "rgb(37 211 102)" },
  telegram: { bg: "rgb(59 130 246 / 0.2)", text: "rgb(59 130 246)", border: "rgb(59 130 246)" },
};

export function RecentExpenses() {
  const [expenses, setExpenses] = useState<RecentExpenseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentExpenses = async () => {
      try {
        const response = await getRecentExpenses();
        if (response.success && response.data) {
          setExpenses(response.data.slice(0, 15));
        }
      } catch (err: any) {
        console.error("Failed to fetch recent expenses:", err);
        setError(err?.message || "Failed to load expenses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentExpenses();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">Recent Expenses</h3>
      </div>
      <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">No expenses yet</p>
          </div>
        ) : (
          expenses.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-secondary/50 transition-colors group"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: getCategoryColor(exp.category).bg,
                    color: getCategoryColor(exp.category).text,
                    border: `1px solid ${getCategoryColor(exp.category).border}`,
                    maxWidth: "65px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={formatCategoryName(exp.category)}
                >
                  {truncateText(formatCategoryName(exp.category), 10)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{exp.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(exp.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize whitespace-nowrap"
                  style={{
                    backgroundColor: sourceColors[exp.source || "whatsapp"].bg,
                    color: sourceColors[exp.source || "whatsapp"].text,
                    border: `1px solid ${sourceColors[exp.source || "whatsapp"].border}`,
                  }}
                >
                  {exp.source || "whatsapp"}
                </span>
                <span className="text-sm font-semibold font-mono text-expense min-w-[70px] text-right">-₹{exp.amount.toLocaleString()}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}