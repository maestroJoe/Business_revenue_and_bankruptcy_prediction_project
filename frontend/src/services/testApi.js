/* ============================= */
/* API CONFIGURATION TEST */
/* ============================= */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function testApiConfiguration() {
  console.log("API Base URL:", API_BASE_URL);

  if (!API_BASE_URL) {
    console.error("API URL is missing. Check your .env file.");
    return false;
  }

  console.log("API configuration loaded successfully.");
  return true;
}
