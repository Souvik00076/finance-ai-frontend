/**
 * Extracts a user-facing message from a caught value.
 * Services throw plain `{ message, success, data }` objects (not Error instances),
 * so check for a `message` field on any object.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}
