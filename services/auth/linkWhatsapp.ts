import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, ApiError } from "../types";

interface LinkWhatsappPayload {
  phone: string;
}

/**
 * Send OTP to user's WhatsApp number for linking
 * @param phoneNumber - Phone number with country code (e.g., +91XXXXXXXXXX)
 * @returns Promise with API response
 */
export const linkWhatsapp = async (
  phoneNumber: string
): Promise<ApiResponse> => {
  try {
    const payload: LinkWhatsappPayload = {
      phone: phoneNumber,
    };

    const response = await apiClient.post<ApiResponse>(
      "/settings/whatsapp-link",
      payload
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    throw {
      message:
        axiosError.response?.data?.message ||
        "Failed to send OTP. Please try again.",
      success: false,
      data: null,
      errors: axiosError.response?.data?.errors,
    };
  }
};
