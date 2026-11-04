"use client";

import { useMemo, useState } from "react";
import { previousRangeFor, rangeFor, type Period } from "@/lib/period";
import { useApiData } from "@/lib/useApiData";
import { getPeriods, type PeriodsData } from "@/services/analytics/explore";
import { PeriodSelector } from "./PeriodSelector";
import { TrendChart } from "./TrendChart";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { TopExpenses } from "./TopExpenses";
import { WeekdayPattern } from "./WeekdayPattern";

const NO_PERIODS: PeriodsData = { months: [], years: [] };

/** Period selector plus every card that follows it. */
export function PeriodAnalytics() {
  const [period, setPeriod] = useState<Period>({ mode: "30d" });
  // If this fails the selector still offers the current month/year.
  const { data: periods } = useApiData<PeriodsData>("periods", async () => (await getPeriods()).data);

  const range = useMemo(() => rangeFor(period), [period]);
  const previousRange = useMemo(() => previousRangeFor(period), [period]);

  return (
    <section className="space-y-4" aria-label="Analytics by period">
      <PeriodSelector period={period} onChange={setPeriod} periods={periods ?? NO_PERIODS} label={range.label} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TrendChart range={range} previousRange={previousRange} />
        </div>
        <CategoryBreakdown range={range} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopExpenses range={range} />
        <WeekdayPattern range={range} />
      </div>
    </section>
  );
}
