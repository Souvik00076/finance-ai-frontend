import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, ApiError } from "../types";

export interface StatisticsData {
  daily_spend: number;
  last_7_days_spend: number;
  last_14_days_spend: number;
  last_month_spend: number;
  last_2_months_spend: number;
}

/**
 * Fetch spending statistics
 * @returns Promise with statistics data
 */
export const getStatistics = async (): Promise<ApiResponse<StatisticsData>> => {
  try {
    const response = await apiClient.get<ApiResponse<StatisticsData>>(
      "/analytics/statistics"
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    throw {
      message:
        axiosError.response?.data?.message ||
        "Failed to fetch statistics.",
      success: false,
      data: null,
      errors: axiosError.response?.data?.errors,
    };
  }
};
