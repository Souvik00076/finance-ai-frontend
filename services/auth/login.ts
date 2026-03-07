import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/constants/api";
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

    const response = await axios.post<ApiResponse<AuthUser>>(
      `${API_BASE_URL}/auth/login`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Important: This ensures cookies are sent and received
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
          "Login failed. Please check your credentials and try again.",
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
