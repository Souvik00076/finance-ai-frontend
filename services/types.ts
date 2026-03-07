/**
 * Standard API Response type for all backend responses
 */
export interface ApiResponse<T = any> {
  message: string;
  success: boolean;
  data: T;
}

/**
 * Authentication related types
 */
export interface SignupData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
}

export interface UserSettings {
  email: string;
  full_name: string;
  picture: string;
  provider: string;
  email_verified: boolean;
  created_at: string;
}

export interface VerifyEmailData {
  verified: boolean;
  message?: string;
}

/**
 * Error response type
 */
export interface ApiError {
  message: string;
  success: false;
  errors?: Record<string, string[]>;
}
