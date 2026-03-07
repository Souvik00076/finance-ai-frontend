import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/constants/api";
import { ApiResponse, ApiError, VerifyEmailData } from "../types";

interface VerifyEmailPayload {
  action_code: string;
  email: string;
}

/**
 * Verify user's email address
 * @param actionCode - Verification action code from email link
 * @param email - User's email address
 * @returns Promise with API response containing verification status
 */
export const verifyEmail = async (
  actionCode: string,
  email: string
): Promise<ApiResponse<VerifyEmailData>> => {
  try {
    const payload: VerifyEmailPayload = {
      action_code: actionCode,
      email,
    };

    const response = await axios.post<ApiResponse<VerifyEmailData>>(
      `${API_BASE_URL}/auth/verify-email`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
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
          "Email verification failed. Please try again.",
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
