import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, ApiError, UserSettings } from "../types";

/**
 * Get user settings from the API
 * @returns Promise with API response containing user settings data
 */
export const getUserSettings = async (): Promise<ApiResponse<UserSettings>> => {
  try {
    const response = await apiClient.get<ApiResponse<UserSettings>>(
      "/settings"
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    // Return formatted error response
    throw {
      message:
        axiosError.response?.data?.message ||
        "Failed to fetch user settings. Please try again.",
      success: false,
      data: null,
      errors: axiosError.response?.data?.errors,
    };
  }
};
