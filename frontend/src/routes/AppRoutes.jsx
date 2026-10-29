
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* ============================= */
/* LAZY-LOADED PAGES */
/* ============================= */

const Overview = lazy(() => import("../pages/Overview"));
const RevenueForecast = lazy(() => import("../pages/RevenueForecast"));
const BankruptcyRisk = lazy(() => import("../pages/BankruptcyRisk"));
const Settings = lazy(() => import("../pages/Settings"));

/* ============================= */
/* APPLICATION ROUTES */
/* ============================= */

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-40 items-center justify-center text-[#77738F]">
          Loading page...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route
          path="/revenue-forecast"
          element={<RevenueForecast />}
        />
        <Route
          path="/bankruptcy-risk"
          element={<BankruptcyRisk />}
        />
        <Route path="/settings" element={<Settings />} />

        {/* Redirect unknown URLs to Overview */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
