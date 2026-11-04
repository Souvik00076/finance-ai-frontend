import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, ApiError } from "../types";
import type { MonthlyTrendItem } from "./getMonthlyTrend";
import type { CategoryBreakdownItem } from "./getCategoryBreakdown";

export interface IncomeStatisticsData {
  daily_earned: number;
  last_7_days_earned: number;
  last_14_days_earned: number;
  last_month_earned: number;     // current calendar month
  last_2_months_earned: number;  // current + previous calendar month
  all_time_earned: number;       // aggregated from income data
}

export interface RecentIncomeItem {
  id: string;
  amount: number;
  category: string;
  source: string;                // who paid, e.g. "Acme Corp"
  date: string;                  // YYYY-MM-DD (IST)
  channel: "whatsapp" | "telegram";
  date_from_message: boolean;    // false = date assumed from message time
}

async function get<T>(path: string, fallbackMessage: string): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.get<ApiResponse<T>>(path);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw {
      message: axiosError.response?.data?.message || fallbackMessage,
      success: false,
      data: null,
      errors: axiosError.response?.data?.errors,
    };
  }
}

export const getIncomeStatistics = () =>
  get<IncomeStatisticsData>("/analytics/income/statistics", "Failed to fetch income statistics.");

export const getIncomeMonthlyTrend = () =>
  get<MonthlyTrendItem[]>("/analytics/income/monthly-trend", "Failed to fetch income monthly trend.");

export const getIncomeCategoryBreakdown = () =>
  get<CategoryBreakdownItem[]>("/analytics/income/category-breakdown", "Failed to fetch income breakdown.");

export const getRecentIncome = () =>
  get<RecentIncomeItem[]>("/analytics/income/recent", "Failed to fetch recent income.");
