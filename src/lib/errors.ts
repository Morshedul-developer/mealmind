import axios from "axios";

export function getRequestErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof TypeError) {
    return "Network error. Check your connection and try again.";
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = error.response?.data?.error;
    if (typeof apiMessage === "string" && apiMessage) return apiMessage;

    // Zod-style validation errors: { formErrors: string[], fieldErrors: Record<string, string[]> }
    if (apiMessage && typeof apiMessage === "object") {
      const fieldErrors = (apiMessage as { fieldErrors?: Record<string, string[]> }).fieldErrors;
      const formErrors = (apiMessage as { formErrors?: string[] }).formErrors;
      const firstFieldError = fieldErrors
        ? Object.entries(fieldErrors).find(([, messages]) => messages?.length)
        : undefined;
      if (firstFieldError) {
        const [field, messages] = firstFieldError;
        return `${field}: ${messages[0]}`;
      }
      if (formErrors?.length) return formErrors[0];
    }

    if (!error.response) return "Network error. Check your connection and try again.";
    return error.message || fallback;
  }
  return getRequestErrorMessage(error, fallback);
}
