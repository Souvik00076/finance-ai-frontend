"use client";

import { BarChart3, TrendingUp, Wallet, CreditCard } from "lucide-react";

export function DashboardPreview() {
  return (
    <div className="w-full bg-card rounded-xl border border-border p-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold">Spendly Dashboard</span>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="text-xs text-muted-foreground mb-1">Total Spent</div>
          <div className="text-xl font-bold">$12,450</div>
          <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +12% vs last month
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="text-xs text-muted-foreground mb-1">Transactions</div>
          <div className="text-xl font-bold">156</div>
          <div className="text-xs text-muted-foreground mt-1">This month</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-xs text-muted-foreground mb-1">Budget Left</div>
          <div className="text-xl font-bold">$2,550</div>
          <div className="text-xs text-orange-500 mt-1">17% remaining</div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Spending Overview</span>
          </div>
          <div className="text-xs text-muted-foreground">Last 7 days</div>
        </div>
        <div className="flex items-end justify-between gap-2 h-24">
          {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-primary/20 rounded-t"
                style={{ height: `${height}%` }}
              >
                <div
                  className="w-full bg-primary rounded-t"
                  style={{ height: `${Math.random() * 60 + 40}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Recent Transactions</span>
        </div>
        <div className="space-y-2">
          {[
            { name: "Grocery Store", amount: "-$85.20", category: "Food" },
            { name: "Netflix", amount: "-$15.99", category: "Entertainment" },
            { name: "Gas Station", amount: "-$45.00", category: "Transport" },
          ].map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <div className="text-sm font-medium">{tx.name}</div>
                <div className="text-xs text-muted-foreground">{tx.category}</div>
              </div>
              <div className="text-sm font-medium text-red-500">{tx.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
