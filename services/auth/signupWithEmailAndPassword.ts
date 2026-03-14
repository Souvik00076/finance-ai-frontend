import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
import { getAuthRedirectUrlAfterSignup } from "@/lib/constants/api";
import { ApiResponse, ApiError } from "../types";

interface SignupPayload {
  email: string;
  password: string;
  name?: string;
  redirect_uri: string;
}

/**
 * Sign up a new user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @param name - Optional user's full name
 * @returns Promise with API response (data will be null for signup)
 */
export const signupWithEmailAndPassword = async (
  email: string,
  password: string,
  name?: string
): Promise<ApiResponse<null>> => {
  try {
    const redirectUrl = getAuthRedirectUrlAfterSignup();
    const payload: SignupPayload = {
      email,
      password,
      ...(name && { full_name: name }),
      redirect_uri: redirectUrl,
    };


    const response = await apiClient.post<ApiResponse<null>>(
      "/auth/signup",
      payload
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    // Return formatted error response
    throw {
      message: axiosError.response?.data?.message || "Signup failed. Please try again.",
      success: false,
      data: null,
      errors: axiosError.response?.data?.errors,
    };
  }
};
