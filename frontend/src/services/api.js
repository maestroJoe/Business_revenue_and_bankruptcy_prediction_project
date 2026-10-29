/* ============================= */
/* API CONFIGURATION */
/* ============================= */

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

/* ============================= */
/* REUSABLE API REQUEST */
/* ============================= */

export async function apiRequest(endpoint, options = {}) {
  let response;

  /* ============================= */
  /* SEND REQUEST */
  /* ============================= */

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Unable to connect to the API. Check the server URL and connection.",
    );
  }

  /* ============================= */
  /* READ RESPONSE */
  /* ============================= */

  const contentType = response.headers.get("content-type") || "";

  let data;

  try {
    data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
  } catch {
    throw new Error("The API returned an unreadable response.");
  }

  /* ============================= */
  /* HANDLE HTTP ERRORS */
  /* ============================= */

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null
        ? data.detail || data.message || "API request failed."
        : data || "API request failed.";

    throw new Error(
      typeof message === "string"
        ? message
        : "The API request failed. Please try again.",
    );
  }

  return data;
}
