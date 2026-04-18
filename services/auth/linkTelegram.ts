import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, ApiError } from "../types";

interface LinkTelegramPayload {
  phone: string;
}

/**
 * Link user's Telegram account by submitting their chat ID
 * @param chatId - The Telegram chat ID obtained from the Spendly bot
 * @returns Promise with API response
 */
export const linkTelegram = async (
  chatId: string
): Promise<ApiResponse> => {
  try {
    const payload: LinkTelegramPayload = {
      phone: chatId,
    };

    const response = await apiClient.post<ApiResponse>(
      "/settings/telegram-link",
      payload
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    throw {
      message:
        axiosError.response?.data?.message ||
        "Failed to link Telegram. Please try again.",
      success: false,
      data: null,
      errors: axiosError.response?.data?.errors,
    };
  }
};
