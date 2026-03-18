import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, ApiError } from "../types";

interface VerifyWhatsappOtpPayload {
  phone_number: string;
  otp: string;
}

/**
 * Verify the OTP sent to user's WhatsApp number
 * @param phoneNumber - Phone number with country code
 * @param otp - 6-digit OTP code
 * @returns Promise with API response
 */
export const verifyWhatsappOtp = async (
  phoneNumber: string,
  otp: string
): Promise<ApiResponse> => {
  try {
    const payload: VerifyWhatsappOtpPayload = {
      phone_number: phoneNumber,
      otp,
    };

    const response = await apiClient.post<ApiResponse>(
      "/settings/phone/verify",
      payload
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    throw {
      message:
        axiosError.response?.data?.message ||
        "OTP verification failed. Please try again.",
      success: false,
      data: null,
      errors: axiosError.response?.data?.errors,
    };
  }
};
