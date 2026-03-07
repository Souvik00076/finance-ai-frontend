import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/constants/api";
import { ApiResponse, ApiError } from "../types";

/**
 * Logout user and clear authentication cookies
 * Server will clear the authentication cookies
 * @returns Promise with API response
 */
export const logout = async (): Promise<ApiResponse<null>> => {
  try {
    const response = await axios.post<ApiResponse<null>>(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Important: This ensures cookies are sent and cleared
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
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

    // Handle non-axios errors
    throw {
      message: "An unexpected error occurred. Please try again.",
      success: false,
      data: null,
    };
  }
};
