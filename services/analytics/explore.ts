import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, ApiError } from "../types";
import type { Granularity } from "@/lib/period";

export type Kind = "expense" | "income";

export interface PeriodsData {
  months: string[]; // "YYYY-MM", newest first
  years: number[]; // newest first
}

export interface TrendPoint {
  period: string; // "YYYY-MM-DD" | "YYYY-MM" | "YYYY"
  amount: number;
}

export interface BreakdownItem {
  name: string;
  amount: number;
}

export interface TopExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  source: "whatsapp" | "telegram";
}

export interface WeekdayItem {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  total: number;
  average: number;
}

type Range = { start: string; end: string };

async function get<T>(path: string, params: Record<string, string | number>, fallback: string): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.get<ApiResponse<T>>(path, { params });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw {
      message: axiosError.response?.data?.message || fallback,
      success: false,
      data: null,
      errors: axiosError.response?.data?.errors,
    };
  }
}

export const getPeriods = () => get<PeriodsData>("/analytics/periods", {}, "Failed to fetch periods.");

export const getTrend = (kind: Kind, range: Range, granularity: Granularity) =>
  get<TrendPoint[]>("/analytics/trend", { kind, ...range, granularity }, "Failed to load trend.");

export const getBreakdown = (kind: Kind, range: Range) =>
  get<BreakdownItem[]>("/analytics/breakdown", { kind, ...range }, "Failed to load breakdown.");

export const getTopExpenses = (range: Range, limit = 5) =>
  get<TopExpenseItem[]>("/analytics/top-expenses", { ...range, limit }, "Failed to load top expenses.");

export const getWeekdayPattern = (range: Range, kind: Kind = "expense") =>
  get<WeekdayItem[]>("/analytics/weekday-pattern", { kind, ...range }, "Failed to load weekday pattern.");
