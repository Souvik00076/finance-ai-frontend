import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { RecentExpenses } from "@/components/dashboard/RecentExpenses";
import { MonthlyBarChart } from "@/components/dashboard/MonthlyBarChart";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader />

      {/* Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <DashboardStats />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ExpenseChart />
          </div>
          <CategoryBreakdown />
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentExpenses />
          <MonthlyBarChart />
        </div>
      </main>
    </div>
  );
}
