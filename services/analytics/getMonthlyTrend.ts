import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, ApiError } from "../types";

export interface MonthlyTrendItem {
  month: string;
  amount: number;
}

/**
 * Fetch monthly spending trend data
 * @returns Promise with array of monthly trend data
 */
export const getMonthlyTrend = async (): Promise<ApiResponse<MonthlyTrendItem[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<MonthlyTrendItem[]>>(
      "/analytics/monthly-trend"
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    throw {
      message:
        axiosError.response?.data?.message ||
        "Failed to fetch monthly trend data.",
      success: false,
      data: null,
      errors: axiosError.response?.data?.errors,
    };
  }
};