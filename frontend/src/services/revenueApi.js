import { getMockRevenueForecast } from "./mockApi";
import { USE_MOCK_API } from "./config";

/* ============================= */
/* REVENUE API SERVICE */
/* ============================= */

export async function getRevenueForecast(input) {
  if (USE_MOCK_API) {
    return getMockRevenueForecast(input);
  }

  throw new Error("Real revenue API is not configured yet.");
}
