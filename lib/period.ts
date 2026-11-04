/**
 * Period selection for the analytics section. All dates are India time (IST),
 * matching the API, and passed around as "YYYY-MM-DD" strings.
 */

export type Granularity = "day" | "month" | "year";

export type Period =
  | { mode: "30d" }
  | { mode: "month"; month: string } // "YYYY-MM"
  | { mode: "year"; year: number }
  | { mode: "all"; since: string }; // earliest "YYYY-MM" with data

export interface DateRange {
  start: string; // YYYY-MM-DD inclusive
  end: string; // YYYY-MM-DD inclusive
  granularity: Granularity;
  label: string; // e.g. "October 2026"
  shortLabel: string; // e.g. "Oct" — used in "vs Oct"
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Today's date in IST as YYYY-MM-DD. */
export function todayIST(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

function parts(date: string): [number, number, number] {
  const [y, m, d] = date.split("-").map(Number);
  return [y, m, d];
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = parts(date);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

const minDate = (a: string, b: string) => (a < b ? a : b);

function daysBetween(start: string, end: string): number {
  const [y1, m1, d1] = parts(start);
  const [y2, m2, d2] = parts(end);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
}

function monthsBetween(startMonth: string, endMonth: string): number {
  const [y1, m1] = startMonth.split("-").map(Number);
  const [y2, m2] = endMonth.split("-").map(Number);
  return (y2 - y1) * 12 + (m2 - m1);
}

export function monthLabel(month: string, long = true): string {
  const [y, m] = month.split("-").map(Number);
  return `${(long ? MONTHS_LONG : MONTHS_SHORT)[m - 1]} ${y}`;
}

/** The date range (capped at today) and chart granularity for a period. */
export function rangeFor(period: Period, today = todayIST()): DateRange {
  switch (period.mode) {
    case "30d":
      return { start: addDays(today, -29), end: today, granularity: "day", label: "Last 30 days", shortLabel: "prev 30 days" };
    case "month": {
      const [y, m] = period.month.split("-").map(Number);
      const start = `${period.month}-01`;
      const end = minDate(`${period.month}-${pad(daysInMonth(y, m))}`, today);
      return { start, end, granularity: "day", label: monthLabel(period.month), shortLabel: MONTHS_SHORT[m - 1] };
    }
    case "year": {
      const end = minDate(`${period.year}-12-31`, today);
      return { start: `${period.year}-01-01`, end, granularity: "month", label: String(period.year), shortLabel: String(period.year) };
    }
    case "all": {
      const months = monthsBetween(period.since, today.slice(0, 7));
      return {
        start: `${period.since}-01`,
        end: today,
        granularity: months > 36 ? "year" : "month",
        label: "All time",
        shortLabel: "all time",
      };
    }
  }
}

/**
 * The comparable previous period, with the same number of days elapsed
 * (so a half-finished month is compared with the first half of last month).
 * Returns null for "all time".
 */
export function previousRangeFor(period: Period, today = todayIST()): DateRange | null {
  const current = rangeFor(period, today);
  switch (period.mode) {
    case "30d": {
      const end = addDays(current.start, -1);
      return { ...current, start: addDays(end, -29), end, label: "Previous 30 days" };
    }
    case "month": {
      const [y, m] = period.month.split("-").map(Number);
      const py = m === 1 ? y - 1 : y;
      const pm = m === 1 ? 12 : m - 1;
      const prevMonth = `${py}-${pad(pm)}`;
      const elapsed = daysBetween(current.start, current.end);
      const prevLast = `${prevMonth}-${pad(daysInMonth(py, pm))}`;
      return {
        start: `${prevMonth}-01`,
        end: minDate(addDays(`${prevMonth}-01`, elapsed), prevLast),
        granularity: "day",
        label: monthLabel(prevMonth),
        shortLabel: MONTHS_SHORT[pm - 1],
      };
    }
    case "year": {
      const py = period.year - 1;
      const [, em, ed] = parts(current.end);
      // 29 Feb has no match in a non-leap year; clamp to the month's last day.
      const day = Math.min(ed, daysInMonth(py, em));
      return { start: `${py}-01-01`, end: `${py}-${pad(em)}-${pad(day)}`, granularity: "month", label: String(py), shortLabel: String(py) };
    }
    case "all":
      return null;
  }
}

/** Axis/tooltip label for a bucket key from the API ("2026-10-05", "2026-10", "2026"). */
export function bucketLabel(key: string, granularity: Granularity, multiYear = false): string {
  if (granularity === "year") return key;
  const [y, m, d] = key.split("-").map(Number);
  if (granularity === "month") return multiYear ? `${MONTHS_SHORT[m - 1]} ${String(y).slice(2)}` : MONTHS_SHORT[m - 1];
  return `${MONTHS_SHORT[m - 1]} ${d}`;
}
