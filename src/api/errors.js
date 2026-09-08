import { message } from "antd";

/**
 * Reads the backend error message from any supported response shape.
 * Backend contract: { message, code } | { msg, code } | plain string
 */
export function getApiErrorMessage(error, fallback = "Something went wrong") {
  const data = error?.response?.data;

  if (!data) {
    return fallback;
  }

  if (typeof data === "string") {
    return data;
  }

  if (typeof data === "object" && data.errors) {
    const firstField = Object.keys(data.errors)[0];
    if (firstField && data.errors[firstField]?.[0]) {
      return data.errors[firstField][0];
    }
  }

  return data.message ?? data.msg ?? fallback;
}

export function showApiError(error, fallback) {
  message.error(getApiErrorMessage(error, fallback));
}

export function showApiSuccess(text) {
  message.success(text);
}
