import { getMockBankruptcyRisk } from "./mockApi";
import { USE_MOCK_API } from "./config";

/* ============================= */
/* BANKRUPTCY API SERVICE */
/* ============================= */

export async function getBankruptcyRisk(input) {
  if (USE_MOCK_API) {
    const result = await getMockBankruptcyRisk();

    return {
      ...result,
      companyName: input.companyName,
    };
  }

  throw new Error("Real bankruptcy API is not configured yet.");
}
