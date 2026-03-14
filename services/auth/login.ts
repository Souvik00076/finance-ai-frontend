import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, ApiError, AuthUser } from "../types";

interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Login user with email and password
 * Server will set authentication cookies automatically
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise with API response containing user data
 */
export const loginWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<ApiResponse<AuthUser>> => {
  try {
    const payload: LoginPayload = {
      email,
      password,
    };

    const response = await apiClient.post<ApiResponse<AuthUser>>(
      "/auth/login",
      payload
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;

    // Return formatted error response
    throw {
      message:
        axiosError.response?.data?.message ||
        "Login failed. Please check your credentials and try again.",
      success: false,
      data: null,
      errors: axiosError.response?.data?.errors,
    };
  }
};
