import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, ApiError } from "../types";

export interface DailyTrendItem {
  date: string;
  amount: number;
}

/**
 * Fetch daily spending trend data
 * @returns Promise with array of daily trend data points
 */
export const getDailyTrend = async (): Promise<ApiResponse<DailyTrendItem[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<DailyTrendItem[]>>(
      "/analytics/daily-trend"
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    throw {
      message:
        axiosError.response?.data?.message ||
        "Failed to fetch daily trend data.",
      success: false,
      data: null,
      errors: axiosError.response?.data?.errors,
    };
  }
};
