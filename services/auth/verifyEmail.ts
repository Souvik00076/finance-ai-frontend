import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
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

    const response = await apiClient.post<ApiResponse<VerifyEmailData>>(
      "/auth/verify-email",
      payload
    );

    return response.data;
  } catch (error) {
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
};
