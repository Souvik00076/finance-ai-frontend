import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, ApiError } from "../types";

/**
 * Logout user and clear authentication cookies
 * Server will clear the authentication cookies
 * @returns Promise with API response
 */
export const logout = async (): Promise<ApiResponse<null>> => {
  try {
    const response = await apiClient.post<ApiResponse<null>>(
      "/auth/logout",
      {}
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    // Return formatted error response
    throw {
      message:
        axiosError.response?.data?.message ||
        "Logout failed. Please try again.",
      success: false,
      data: null,
      errors: axiosError.response?.data?.errors,
    };
  }
};
