/** Short axis label: ₹950, ₹1.5k, ₹12k, ₹1.2L (one decimal only when it matters). */
export function compactRupees(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const trim = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, ""));
  if (abs >= 100000) return `${sign}₹${trim(Math.round(abs / 10000) / 10)}L`;
  if (abs >= 1000) return `${sign}₹${trim(abs >= 10000 ? Math.round(abs / 1000) : Math.round(abs / 100) / 10)}k`;
  return `${sign}₹${Math.round(abs)}`;
}
