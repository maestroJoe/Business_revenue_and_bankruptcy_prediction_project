
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faShieldHalved,
  faArrowRight,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

/* ============================= */
/* OVERVIEW PAGE */
/* ============================= */

export default function Overview() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* ============================= */}
      {/* PAGE INTRODUCTION */}
      {/* ============================= */}

      <section>
        <p className="text-sm font-semibold tracking-wide text-primary">
          FINANCIAL ANALYTICS PLATFORM
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Understand the numbers.
          <br className="hidden sm:block" />
          Make informed decisions.
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base">
          Explore company revenue forecasts and assess financial
          distress risk using machine learning models.
        </p>
      </section>

      {/* ============================= */}
      {/* ANALYTICS FEATURES */}
      {/* ============================= */}

      <section className="grid gap-5 md:grid-cols-2">
        {/* REVENUE FORECASTING */}

        <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-soft text-teal">
            <FontAwesomeIcon icon={faChartLine} size="lg" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-ink">
            Revenue Forecasting
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted">
            Estimate future company revenue from historical financial
            data and examine projected trends.
          </p>

          <Link
            to="/revenue-forecast"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal transition hover:text-ink"
          >
            Explore forecasting
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </article>

        {/* BANKRUPTCY RISK */}

        <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-soft text-amber">
            <FontAwesomeIcon icon={faShieldHalved} size="lg" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-ink">
            Bankruptcy Risk
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted">
            Evaluate financial indicators and classify potential
            bankruptcy risk using a machine learning model.
          </p>

          <Link
            to="/bankruptcy-risk"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber transition hover:text-ink"
          >
            Assess financial risk
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </article>
      </section>

      {/* ============================= */}
      {/* PROJECT STATUS */}
      {/* ============================= */}

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <FontAwesomeIcon icon={faCircleCheck} />
          </div>

          <div>
            <h2 className="font-semibold text-ink">Project status</h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              The frontend is connected to mock services for revenue forecasting
              and bankruptcy risk assessment. Both workflows support input
              validation and display demo results.
            </p>

            <p className="mt-3 text-xs font-medium text-amber">
              Demo mode · Real ML predictions require backend integration.
            </p>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* FOOTER */}
      {/* ============================= */}

      <footer className="border-t border-border pt-5 text-xs text-muted">
        FinGuard AI · Financial intelligence for educational use
      </footer>
    </div>
  );
}
