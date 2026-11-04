"use client";

import { CalendarRange } from "lucide-react";
import { monthLabel, todayIST, type Period } from "@/lib/period";
import type { PeriodsData } from "@/services/analytics/explore";

interface PeriodSelectorProps {
  period: Period;
  onChange: (period: Period) => void;
  periods: PeriodsData;
  label: string;
}

const modes: { id: Period["mode"]; label: string }[] = [
  { id: "30d", label: "30 days" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
  { id: "all", label: "All time" },
];

export function PeriodSelector({ period, onChange, periods, label }: PeriodSelectorProps) {
  const currentMonth = todayIST().slice(0, 7);
  const currentYear = Number(currentMonth.slice(0, 4));
  // Always offer the current month/year, plus every month/year that has data.
  const months = [...new Set([currentMonth, ...periods.months])].sort().reverse();
  const years = [...new Set([currentYear, ...periods.years])].sort((a, b) => b - a);
  const earliest = periods.months[periods.months.length - 1] ?? currentMonth;

  const select = (mode: Period["mode"]) => {
    if (mode === period.mode) return;
    if (mode === "30d") onChange({ mode });
    else if (mode === "month") onChange({ mode, month: months[0] });
    else if (mode === "year") onChange({ mode, year: years[0] });
    else onChange({ mode, since: earliest });
  };

  const selectClass =
    "h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="glass-card px-4 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <CalendarRange className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-sm font-semibold truncate">{label}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/60" role="tablist" aria-label="Period">
          {modes.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={period.mode === m.id}
              onClick={() => select(m.id)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                period.mode === m.id
                  ? "bg-background text-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        {period.mode === "month" && (
          <select
            aria-label="Month"
            className={selectClass}
            value={period.month}
            onChange={(e) => onChange({ mode: "month", month: e.target.value })}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {monthLabel(m)}
              </option>
            ))}
          </select>
        )}
        {period.mode === "year" && (
          <select
            aria-label="Year"
            className={selectClass}
            value={period.year}
            onChange={(e) => onChange({ mode: "year", year: Number(e.target.value) })}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
