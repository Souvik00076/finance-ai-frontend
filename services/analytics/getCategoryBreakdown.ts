import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, ApiError } from "../types";

export interface CategoryBreakdownItem {
  name: string;
  amount: number;
}

/**
 * Fetch category breakdown data
 * @returns Promise with array of category breakdown data
 */
export const getCategoryBreakdown = async (): Promise<ApiResponse<CategoryBreakdownItem[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<CategoryBreakdownItem[]>>(
      "/analytics/category-breakdown"
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    throw {
      message:
        axiosError.response?.data?.message ||
        "Failed to fetch category breakdown.",
      success: false,
      data: null,
      errors: axiosError.response?.data?.errors,
    };
  }
};