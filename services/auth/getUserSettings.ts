import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/constants/api";
import { ApiResponse, ApiError, UserSettings } from "../types";

/**
 * Get user settings from the API
 * @returns Promise with API response containing user settings data
 */
export const getUserSettings = async (): Promise<ApiResponse<UserSettings>> => {
  try {
    const response = await axios.get<ApiResponse<UserSettings>>(
      `${API_BASE_URL}/settings`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Important: This ensures cookies are sent
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;

      // Check if it's an unauthorized error
      if (axiosError.response?.status === 401) {
        throw {
          message: "Unauthorized",
          success: false,
          data: null,
          status: 401,
          errors: axiosError.response?.data?.errors,
        };
      }

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

    // Handle non-axios errors
    throw {
      message: "An unexpected error occurred. Please try again.",
      success: false,
      data: null,
    };
  }
};
