"use client";

import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";
import type { DateRange } from "@/lib/period";
import { useApiData } from "@/lib/useApiData";
import { compactRupees } from "@/lib/format";
import { getWeekdayPattern, type WeekdayItem } from "@/services/analytics/explore";

const BAR = "hsl(168, 80%, 50%)";
const BAR_PEAK = "hsl(0, 72%, 55%)";
const FULL_DAY: Record<WeekdayItem["day"], string> = {
  Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday",
};

export function WeekdayPattern({ range }: { range: DateRange }) {
  const { data, error, isLoading } = useApiData<WeekdayItem[]>(
    `weekday|${range.start}|${range.end}`,
    async () => (await getWeekdayPattern(range, "expense")).data,
    "Failed to load weekday pattern",
  );
  const items = data ?? [];
  const peak = items.reduce<WeekdayItem | null>((best, d) => (!best || d.average > best.average ? d : best), null);
  const hasData = items.some((d) => d.total > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">Spending by Weekday</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Average per day · {range.label}
          {hasData && peak && (
            <>
              {" · "}
              <span className="text-foreground font-medium">{FULL_DAY[peak.day]}s</span> cost the most
            </>
          )}
        </p>
      </div>
      <div className="h-[200px]">
        {isLoading && !data ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">No spending in {range.label}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={items}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }}
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={(v: number) => compactRupees(v)}
              />
              <Tooltip
                cursor={{ fill: "hsl(220, 14%, 16%, 0.4)" }}
                contentStyle={{
                  background: "hsl(220, 18%, 10%)",
                  border: "1px solid hsl(220, 14%, 16%)",
                  borderRadius: "8px",
                  fontSize: 12,
                  color: "hsl(210, 20%, 95%)",
                }}
                labelFormatter={(day) => FULL_DAY[day as WeekdayItem["day"]] ?? String(day)}
                formatter={(value, _name, item) => {
                  const row = (item as { payload?: WeekdayItem })?.payload;
                  return [
                    `₹${Math.round(Number(value)).toLocaleString("en-IN")} avg · ₹${Math.round(row?.total ?? 0).toLocaleString("en-IN")} total`,
                    "",
                  ];
                }}
              />
              <Bar dataKey="average" radius={[4, 4, 0, 0]}>
                {items.map((d) => (
                  <Cell key={d.day} fill={d.day === peak?.day ? BAR_PEAK : BAR} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
