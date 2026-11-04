"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  /** Up is good (income): up = green, down = red. Default is spending: up = red. */
  invertTrend?: boolean;
  /** Extra classes for the value, e.g. a green/red colour for net amounts. */
  valueClassName?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  invertTrend = false,
  valueClassName = "",
  delay = 0,
}: StatCardProps) {
  const upIsBad = !invertTrend;
  const trendClass = trend
    ? (trend.value >= 0) === upIsBad
      ? "text-expense"
      : "text-success"
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-5 flex flex-col gap-3 group hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>
      <div>
        <p className={`text-2xl font-bold tracking-tight ${valueClassName}`}>{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {trend && (
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-medium ${trendClass}`}>
            {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-muted-foreground">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}
