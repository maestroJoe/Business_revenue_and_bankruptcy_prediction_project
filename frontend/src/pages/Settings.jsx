
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

/* ============================= */
/* SETTINGS PAGE */
/* ============================= */

export default function Settings() {
  return (
    <section className="mx-auto max-w-4xl space-y-6">
      {/* ============================= */}
      {/* PAGE HEADER */}
      {/* ============================= */}

      <div>
        <p className="text-sm font-medium text-primary">
          WORKSPACE
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
          Settings
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted">
          Basic preferences for your FinGuard AI workspace.
        </p>
      </div>

      {/* ============================= */}
      {/* APPEARANCE SETTINGS */}
      {/* ============================= */}

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <FontAwesomeIcon icon={faSliders} />
          </div>

          <div>
            <h2 className="font-semibold text-ink">
              Appearance
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted">
              FinGuard AI uses a warm, light workspace theme
              with lavender and teal accents.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-canvas p-4 text-sm leading-6 text-muted">
          Theme customization is not enabled in this MVP.
        </div>
      </div>

      {/* ============================= */}
      {/* BACK NAVIGATION */}
      {/* ============================= */}

      <Link
        to="/"
        className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Back to Overview
      </Link>
    </section>
  );
}
