"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";
import { bucketLabel, type DateRange } from "@/lib/period";
import { useApiData } from "@/lib/useApiData";
import { compactRupees } from "@/lib/format";
import { getTrend, type TrendPoint } from "@/services/analytics/explore";

type Series = "expense" | "income" | "both";

const COLORS = {
  expense: "hsl(168, 80%, 50%)", // brand teal, as before
  income: "hsl(152, 60%, 48%)",
  bothExpense: "hsl(0, 72%, 55%)", // red when shown next to income
  previous: "hsl(38, 92%, 55%)", // amber: stands out from teal/green/red in both themes
};

const tooltipStyle = {
  background: "hsl(220, 18%, 10%)",
  border: "1px solid hsl(220, 14%, 16%)",
  borderRadius: "8px",
  fontSize: 12,
  color: "hsl(210, 20%, 95%)",
};

const rupees = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const sum = (points: TrendPoint[] | null | undefined) => (points ?? []).reduce((s, p) => s + p.amount, 0);

type Loaded =
  | { kind: "single"; current: TrendPoint[]; previous: TrendPoint[] | null }
  | { kind: "both"; expense: TrendPoint[]; income: TrendPoint[] };

type Row = {
  label: string;
  current?: number;
  previous?: number;
  previousLabel?: string;
  expense?: number;
  income?: number;
};

interface TrendChartProps {
  range: DateRange;
  previousRange: DateRange | null;
}

export function TrendChart({ range, previousRange }: TrendChartProps) {
  const [series, setSeries] = useState<Series>("expense");
  const [compare, setCompare] = useState(true);
  const canCompare = series !== "both" && previousRange !== null;
  const showCompare = canCompare && compare;

  const key = [series, showCompare, range.start, range.end, range.granularity, previousRange?.start, previousRange?.end].join("|");
  const { data, error, isLoading } = useApiData<Loaded>(key, async () => {
    if (series === "both") {
      const [e, i] = await Promise.all([
        getTrend("expense", range, range.granularity),
        getTrend("income", range, range.granularity),
      ]);
      return { kind: "both", expense: e.data, income: i.data };
    }
    const [current, previous] = await Promise.all([
      getTrend(series, range, range.granularity),
      showCompare && previousRange ? getTrend(series, previousRange, previousRange.granularity) : Promise.resolve(null),
    ]);
    return { kind: "single", current: current.data, previous: previous?.data ?? null };
  }, "Failed to load trend");

  const multiYear = range.start.slice(0, 4) !== range.end.slice(0, 4);
  const label = (p: TrendPoint) => bucketLabel(p.period, range.granularity, multiYear);

  let rows: Row[] = [];
  let summary: { total: number; change: number | null } | null = null;
  if (data?.kind === "single") {
    rows = data.current.map((p, i) => ({
      label: label(p),
      current: p.amount,
      previous: data.previous?.[i]?.amount,
      previousLabel: data.previous?.[i] ? bucketLabel(data.previous[i].period, range.granularity, true) : undefined,
    }));
    const total = sum(data.current);
    const prev = sum(data.previous);
    summary = {
      total,
      change: data.previous && prev > 0 ? Math.round(((total - prev) / prev) * 100) : null,
    };
  } else if (data?.kind === "both") {
    rows = data.expense.map((p, i) => ({ label: label(p), expense: p.amount, income: data.income[i]?.amount ?? 0 }));
  }

  const hasData = rows.some((r) => (r.current ?? 0) || (r.previous ?? 0) || (r.expense ?? 0) || (r.income ?? 0));
  const bothTotals = data?.kind === "both" ? { income: sum(data.income), expense: sum(data.expense) } : null;
  const title = series === "expense" ? "Spending Trend" : series === "income" ? "Income Trend" : "Income vs Spending";
  // Spending going up is bad (red); income going up is good (green).
  const changeIsGood = summary?.change != null && (series === "income" ? summary.change >= 0 : summary.change <= 0);
  const mainColor = series === "income" ? COLORS.income : COLORS.expense;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-5 h-full"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
          {summary && (
            <p className="mt-1 text-xs text-muted-foreground">
              <span className="text-base font-semibold text-foreground font-mono">{rupees(summary.total)}</span>{" "}
              {range.label === "All time" ? "overall" : `in ${range.label}`}
              {summary.change !== null && previousRange && (
                <span
                  className={`ml-2 font-medium ${
                    summary.change === 0 ? "text-muted-foreground" : changeIsGood ? "text-success" : "text-expense"
                  }`}
                >
                  {summary.change === 0 ? "=" : summary.change > 0 ? "↑" : "↓"} {Math.abs(summary.change)}% vs{" "}
                  {previousRange.shortLabel}
                </span>
              )}
            </p>
          )}
          {bothTotals && (
            <p className="mt-1 text-xs text-muted-foreground">
              Net{" "}
              <span
                className={`text-base font-semibold font-mono ${
                  bothTotals.income - bothTotals.expense >= 0 ? "text-success" : "text-expense"
                }`}
              >
                {bothTotals.income - bothTotals.expense < 0 ? "-" : "+"}
                {rupees(Math.abs(bothTotals.income - bothTotals.expense))}
              </span>{" "}
              {range.label === "All time" ? "overall" : `in ${range.label}`}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canCompare && (
            <button
              onClick={() => setCompare((c) => !c)}
              aria-pressed={compare}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors whitespace-nowrap ${
                compare ? "border-amber-400/50 text-amber-500 bg-amber-400/10" : "border-border text-muted-foreground"
              }`}
              title={`Overlay ${previousRange?.label}`}
            >
              <span className="inline-flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="inline-block w-3 border-t-2 border-dashed"
                  style={{ borderColor: compare ? COLORS.previous : "currentColor" }}
                />
                vs {previousRange?.shortLabel}
              </span>
            </button>
          )}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/60" role="tablist" aria-label="Series">
            {(["expense", "income", "both"] as Series[]).map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={series === s}
                onClick={() => setSeries(s)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                  series === s ? "bg-background text-foreground shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "expense" ? "Spending" : s === "income" ? "Income" : "Both"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[260px]">
        {isLoading && !data ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">No data for {range.label}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={rows} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="trendMain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={mainColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={mainColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="trendIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.income} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={COLORS.income} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="trendExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.bothExpense} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={COLORS.bothExpense} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={16}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }}
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={(v: number) => compactRupees(v)}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name, item) => {
                  const row = (item as { payload?: Row })?.payload;
                  if (name === "previous") return [rupees(Number(value)), row?.previousLabel ?? previousRange?.label ?? "Previous"];
                  if (name === "current") return [rupees(Number(value)), range.label];
                  return [rupees(Number(value)), name === "income" ? "Income" : "Spending"];
                }}
              />
              {data?.kind === "both" ? (
                <>
                  <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} formatter={(v) => (v === "income" ? "Income" : "Spending")} />
                  <Area type="monotone" dataKey="income" stroke={COLORS.income} strokeWidth={2} fill="url(#trendIncome)" />
                  <Area type="monotone" dataKey="expense" stroke={COLORS.bothExpense} strokeWidth={2} fill="url(#trendExpense)" />
                </>
              ) : (
                <>
                  {showCompare && (
                    <Line
                      type="monotone"
                      dataKey="previous"
                      stroke={COLORS.previous}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={false}
                      connectNulls
                    />
                  )}
                  <Area type="monotone" dataKey="current" stroke={mainColor} strokeWidth={2} fill="url(#trendMain)" />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
