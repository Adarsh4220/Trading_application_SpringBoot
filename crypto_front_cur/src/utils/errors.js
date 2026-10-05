export function getApiErrorMessage(error) {
  if (!error) return "Something went wrong.";

  if (!error.response) {
    if (error.code === "AI_NOT_CONFIGURED") return error.message;
    return "Unable to connect to CryptoX server.";
  }

  const status = error.response.status;
  const data = error.response.data;

  if (typeof data === "string" && data.trim()) return data;
  if (data?.message && typeof data.message === "string") return data.message;
  if (data?.error && typeof data.error === "string") return data.error;

  if (status === 400) return "Please check your request and try again.";
  if (status === 401) return "Your session has expired. Please login again.";
  if (status === 403) return "You don't have permission to perform this action.";
  if (status === 404) return "The requested resource was not found.";
  if (status === 409) return "This action conflicts with the current account state.";
  if (status >= 500) return "Something went wrong on the server.";

  return "Something went wrong.";
}

export function isAuthFailureMessage(message) {
  const text = String(message || "").toLowerCase();
  return (
    text.includes("invalid email or password") ||
    text.includes("user not found") ||
    text.includes("email already registered") ||
    text.includes("invalid or expired otp")
  );
}
