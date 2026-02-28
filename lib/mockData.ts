export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

// Mock expenses data
export const expenses: Expense[] = [
  { id: "1", amount: 250, category: "Food", description: "Lunch at cafe", date: new Date() },
  { id: "2", amount: 1500, category: "Transport", description: "Uber ride", date: new Date() },
  { id: "3", amount: 500, category: "Shopping", description: "Groceries", date: new Date(Date.now() - 86400000) },
  { id: "4", amount: 2000, category: "Entertainment", description: "Movie tickets", date: new Date(Date.now() - 86400000 * 2) },
  { id: "5", amount: 800, category: "Food", description: "Dinner", date: new Date(Date.now() - 86400000 * 3) },
  { id: "6", amount: 3500, category: "Shopping", description: "Clothes", date: new Date(Date.now() - 86400000 * 5) },
  { id: "7", amount: 150, category: "Food", description: "Coffee", date: new Date(Date.now() - 86400000 * 6) },
  { id: "8", amount: 1200, category: "Bills", description: "Electricity bill", date: new Date(Date.now() - 86400000 * 10) },
  { id: "9", amount: 4500, category: "Transport", description: "Fuel", date: new Date(Date.now() - 86400000 * 15) },
  { id: "10", amount: 2500, category: "Entertainment", description: "Concert tickets", date: new Date(Date.now() - 86400000 * 20) },
];

export function getTodayTotal(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return expenses
    .filter((e) => {
      const expenseDate = new Date(e.date);
      expenseDate.setHours(0, 0, 0, 0);
      return expenseDate.getTime() === today.getTime();
    })
    .reduce((sum, e) => sum + e.amount, 0);
}

export function getWeekTotal(): number {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  
  return expenses
    .filter((e) => new Date(e.date) >= weekAgo)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function getMonthTotal(): number {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return expenses
    .filter((e) => new Date(e.date) >= monthStart)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function getCategoryTotals(): Record<string, number> {
  return expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);
}

export function getDailyTrend(): { date: string; amount: number }[] {
  const days = 14;
  const trend: { date: string; amount: number }[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    const dayTotal = expenses
      .filter((e) => {
        const expenseDate = new Date(e.date);
        return (
          expenseDate.getDate() === date.getDate() &&
          expenseDate.getMonth() === date.getMonth() &&
          expenseDate.getFullYear() === date.getFullYear()
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);
    
    trend.push({ date: dateStr, amount: dayTotal || Math.floor(Math.random() * 2000) + 500 });
  }
  
  return trend;
}

export function getCategoryBreakdown(): { name: string; value: number }[] {
  const totals = getCategoryTotals();
  
  return Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getLast7DaysExpenses(): Expense[] {
  const weekAgo = new Date(Date.now() - 7 * 86400000);
  
  return expenses
    .filter((e) => new Date(e.date) >= weekAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getMonthlyTrend(): { month: string; amount: number }[] {
  const months = 6;
  const trend: { month: string; amount: number }[] = [];
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toLocaleDateString("en-US", { month: "short" });
    
    const monthTotal = expenses
      .filter((e) => {
        const expenseDate = new Date(e.date);
        return (
          expenseDate.getMonth() === date.getMonth() &&
          expenseDate.getFullYear() === date.getFullYear()
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);
    
    // Use actual data or generate random for demo
    trend.push({ month: monthStr, amount: monthTotal || Math.floor(Math.random() * 15000) + 5000 });
  }
  
  return trend;
}
