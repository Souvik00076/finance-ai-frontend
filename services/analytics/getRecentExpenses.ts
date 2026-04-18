import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, ApiError } from "../types";

export interface RecentExpenseItem {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  source: "whatsapp" | "telegram";
}

/**
 * Fetch recent expenses
 * @returns Promise with array of recent expenses
 */
export const getRecentExpenses = async (): Promise<ApiResponse<RecentExpenseItem[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<RecentExpenseItem[]>>(
      "/analytics/recent-expenses"
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    throw {
      message:
        axiosError.response?.data?.message ||
        "Failed to fetch recent expenses.",
      success: false,
      data: null,
      errors: axiosError.response?.data?.errors,
    };
  }
};
