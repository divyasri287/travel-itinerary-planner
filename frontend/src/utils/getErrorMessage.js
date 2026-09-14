/**
 * Extracts a user-friendly message from an Axios error, falling back to a
 * sensible default rather than surfacing raw technical errors (stack
 * traces, network error strings, etc.) to the user.
 */
export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (!error) return fallback;

  // Server responded with a JSON error body containing a message.
  const serverMessage = error.response?.data?.message;
  if (serverMessage && typeof serverMessage === "string") {
    return serverMessage;
  }

  // Network / no response at all (server down, offline, CORS, etc.)
  if (error.request && !error.response) {
    return "Can't reach the server right now. Check your connection and try again.";
  }

  // Known HTTP status fallbacks when the server didn't send a message.
  const status = error.response?.status;
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 403) return "You don't have permission to do that.";
  if (status === 404) return "We couldn't find what you were looking for.";
  if (status >= 500) return "Something went wrong on our end. Please try again shortly.";

  return fallback;
};

export default getErrorMessage;
