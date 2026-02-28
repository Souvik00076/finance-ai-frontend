"use client";

import { motion } from "framer-motion";
import { getLast7DaysExpenses } from "@/lib/mockData";
import { MessageSquare } from "lucide-react";

const categoryColors: Record<string, string> = {
  Food: "bg-chart-3/20 text-warning",
  Transport: "bg-chart-2/20 text-chart-2",
  Shopping: "bg-chart-4/20 text-chart-4",
  Bills: "bg-chart-5/20 text-expense",
  Entertainment: "bg-chart-1/20 text-primary",
  Health: "bg-chart-6/20 text-success",
  Groceries: "bg-chart-3/20 text-warning",
  Subscriptions: "bg-chart-2/20 text-chart-2",
};

export function RecentExpenses() {
  const expenses = getLast7DaysExpenses().slice(0, 15);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">Recent Expenses</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MessageSquare className="w-3 h-3" />
          <span>via WhatsApp</span>
        </div>
      </div>
      <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
        {expenses.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[exp.category] || "bg-muted text-muted-foreground"}`}>
                {exp.category}
              </span>
              <div>
                <p className="text-sm font-medium">{exp.description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(exp.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold font-mono text-expense">-₹{exp.amount.toLocaleString()}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
