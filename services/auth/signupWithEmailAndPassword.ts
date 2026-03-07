import axios, { AxiosError } from "axios";
import { API_BASE_URL, getAuthRedirectUrlAfterSignup } from "@/lib/constants/api";
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


    const response = await axios.post<ApiResponse<null>>(
      `${API_BASE_URL}/auth/signup`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      // Return formatted error response
      throw {
        message: axiosError.response?.data?.message || "Signup failed. Please try again.",
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
