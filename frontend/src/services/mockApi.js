/* ============================= */
/* MOCK API CONFIGURATION */
/* ============================= */

const MOCK_DELAY = 600;

function simulateApiDelay() {
  return new Promise((resolve) => {
    setTimeout(resolve, MOCK_DELAY);
  });
}

/* ============================= */
/* MOCK REVENUE FORECAST */
/* ============================= */

export async function getMockRevenueForecast(input = {}) {
  await simulateApiDelay();

  const {
    companyName = "Example Industries",
    revenue = 50000000,
    growthRate = 8,
    forecastYears = 3,
  } = input;

  const forecast = Array.from({ length: forecastYears }, (_, index) => ({
    year: new Date().getFullYear() + index + 1,
    revenue: revenue * Math.pow(1 + growthRate / 100, index + 1),
  }));

  return {
    success: true,
    isMock: true,
    message: "Demo forecast generated successfully.",
    companyName,
    currency: "INR",
    forecast,
  };
}

/* ============================= */
/* MOCK BANKRUPTCY RISK */
/* ============================= */

export async function getMockBankruptcyRisk() {
  await simulateApiDelay();

  return {
    success: true,
    isMock: true,
    message: "Demo bankruptcy assessment generated.",
    companyName: "Example Industries",
    riskLevel: "Medium",
    riskProbability: 0.35,
  };
}
