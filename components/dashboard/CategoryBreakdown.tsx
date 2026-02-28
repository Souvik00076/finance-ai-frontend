"use client";

import { motion } from "framer-motion";
import { getCategoryBreakdown } from "@/lib/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "hsl(168, 80%, 50%)",
  "hsl(200, 70%, 55%)",
  "hsl(38, 92%, 55%)",
  "hsl(280, 60%, 60%)",
  "hsl(0, 72%, 55%)",
  "hsl(152, 60%, 48%)",
  "hsl(320, 60%, 55%)",
  "hsl(45, 80%, 55%)",
];

export function CategoryBreakdown() {
  const data = getCategoryBreakdown();
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-5"
    >
      <h3 className="text-sm font-semibold text-muted-foreground mb-4">Category Breakdown</h3>
      <div className="flex gap-4 items-center">
        <div className="w-[140px] h-[140px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 18%, 10%)",
                  border: "1px solid hsl(220, 14%, 16%)",
                  borderRadius: "8px",
                  fontSize: 12,
                  color: "hsl(210, 20%, 95%)",
                }}
                formatter={(value) => [`₹${value}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {data.slice(0, 5).map((item, i) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-secondary-foreground">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium font-mono text-xs">₹{item.value.toLocaleString()}</span>
                <span className="text-muted-foreground text-xs">{Math.round((item.value / total) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
