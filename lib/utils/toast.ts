import { toast } from "sonner";

/**
 * Toast configuration for consistent positioning and styling
 */
const TOAST_CONFIG = {
  position: "bottom-right" as const,
  duration: 4000,
};

/**
 * Show success toast message
 */
export const showSuccessToast = (message: string) => {
  toast.success(message, TOAST_CONFIG);
};

/**
 * Show error toast message
 */
export const showErrorToast = (message: string) => {
  toast.error(message, TOAST_CONFIG);
};

/**
 * Show info toast message
 */
export const showInfoToast = (message: string) => {
  toast.info(message, TOAST_CONFIG);
};

/**
 * Show warning toast message
 */
export const showWarningToast = (message: string) => {
  toast.warning(message, TOAST_CONFIG);
};

/**
 * Show loading toast message
 * Returns toast ID that can be used to dismiss the toast
 */
export const showLoadingToast = (message: string) => {
  return toast.loading(message, TOAST_CONFIG);
};

/**
 * Dismiss a specific toast by ID
 */
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};
