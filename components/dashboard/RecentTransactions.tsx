"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import {
  getRecentExpenses,
  getRecentIncome,
  RecentExpenseItem,
  RecentIncomeItem,
} from "@/services/analytics";

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

const formatCategoryName = (category: string) => category.replace(/_/g, " ");

const truncateText = (text: string, maxLength: number) =>
  text.length <= maxLength ? text : text.slice(0, maxLength - 2) + "..";

const sourceColors = {
  whatsapp: { bg: "rgb(37 211 102 / 0.2)", text: "rgb(37 211 102)", border: "rgb(37 211 102)" },
  telegram: { bg: "rgb(59 130 246 / 0.2)", text: "rgb(59 130 246)", border: "rgb(59 130 246)" },
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
};

type Tab = "all" | "expense" | "income";

type Row = {
  key: string;
  kind: "expense" | "income";
  amount: number;
  category: string;
  label: string;
  date: string;
  channel: "whatsapp" | "telegram";
  dateAssumed: boolean;
};

const LIMIT = 15;

export function RecentTransactions() {
  const [expenses, setExpenses] = useState<RecentExpenseItem[]>([]);
  const [income, setIncome] = useState<RecentIncomeItem[]>([]);
  const [incomeAvailable, setIncomeAvailable] = useState(true);
  const [tab, setTab] = useState<Tab>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      const [expRes, incRes] = await Promise.allSettled([getRecentExpenses(), getRecentIncome()]);
      if (expRes.status === "fulfilled" && expRes.value.success) {
        setExpenses(expRes.value.data);
      } else if (expRes.status === "rejected") {
        console.error("Failed to fetch recent expenses:", expRes.reason);
        setError(expRes.reason?.message || "Failed to load transactions");
      }
      if (incRes.status === "fulfilled" && incRes.value.success) {
        setIncome(incRes.value.data);
      } else if (incRes.status === "rejected") {
        // Income is optional: treat as "no income yet" instead of breaking the card.
        console.error("Failed to fetch recent income:", incRes.reason);
        setIncomeAvailable(false);
      }
      setIsLoading(false);
    };
    fetchAll();
  }, []);

  const rows = useMemo<Row[]>(() => {
    const exp: Row[] = expenses.map((e, i) => ({
      key: `e-${e.id}-${i}`,
      kind: "expense",
      amount: e.amount,
      category: e.category,
      label: e.description,
      date: e.date,
      channel: e.source || "whatsapp",
      dateAssumed: false,
    }));
    const inc: Row[] = income.map((e, i) => ({
      key: `i-${e.id}-${i}`,
      kind: "income",
      amount: e.amount,
      category: e.category,
      label: e.source,
      date: e.date,
      channel: e.channel || "whatsapp",
      dateAssumed: !e.date_from_message,
    }));
    const pick = tab === "expense" ? exp : tab === "income" ? inc : [...exp, ...inc];
    // Both lists arrive newest-first; a stable sort by date keeps that order within a day.
    return [...pick].sort((a, b) => b.date.localeCompare(a.date)).slice(0, LIMIT);
  }, [expenses, income, tab]);

  const emptyText =
    tab === "income"
      ? incomeAvailable
        ? "No income yet. Try sending “Got salary 50k from Acme”"
        : "Income data is not available yet"
      : tab === "expense"
        ? "No expenses yet"
        : "No transactions yet";

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "expense", label: "Expenses" },
    { id: "income", label: "Income" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4 gap-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Recent Transactions</h3>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/60" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                tab === t.id
                  ? "bg-background text-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : error && tab !== "income" && rows.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">{emptyText}</p>
          </div>
        ) : (
          rows.map((row, i) => {
            const cat = getCategoryColor(row.category);
            const src = sourceColors[row.channel] ?? sourceColors.whatsapp;
            const isIncome = row.kind === "income";
            return (
              <motion.div
                key={row.key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * i }}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: cat.bg,
                      color: cat.text,
                      border: `1px solid ${cat.border}`,
                      maxWidth: "65px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={formatCategoryName(row.category)}
                  >
                    {truncateText(formatCategoryName(row.category), 10)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{row.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(row.date)}
                      {row.dateAssumed && (
                        <span
                          className="ml-1 cursor-help"
                          title="No date in the message — using the time it was sent"
                        >
                          ≈
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize whitespace-nowrap"
                    style={{ backgroundColor: src.bg, color: src.text, border: `1px solid ${src.border}` }}
                  >
                    {row.channel}
                  </span>
                  <span
                    className={`text-sm font-semibold font-mono min-w-[70px] text-right ${
                      isIncome ? "text-success" : "text-expense"
                    }`}
                  >
                    {isIncome ? "+" : "-"}₹{row.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
