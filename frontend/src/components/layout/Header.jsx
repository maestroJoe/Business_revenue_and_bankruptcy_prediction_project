
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

/* ============================= */
/* PAGE TITLES */
/* ============================= */

const pageTitles = {
  "/": "Overview",
  "/revenue-forecast": "Revenue Forecast",
  "/bankruptcy-risk": "Bankruptcy Risk",
  "/settings": "Settings",
};

/* ============================= */
/* HEADER */
/* ============================= */

export default function Header({ setIsOpen }) {
  const { pathname } = useLocation();
  const activePage = pageTitles[pathname] || "Overview";

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);

  /* ============================= */
  /* CLOSE NOTIFICATIONS ON OUTSIDE CLICK */
  /* ============================= */

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* ============================= */
  /* HEADER UI */
  /* ============================= */

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur-xl sm:px-8">
      {/* ============================= */}
      {/* PAGE TITLE */}
      {/* ============================= */}

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-canvas hover:text-ink lg:hidden"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div>
          <p className="text-xs text-muted">
            Workspace / FinGuard AI
          </p>

          <h2 className="mt-1 text-base font-semibold text-ink sm:text-lg">
            {activePage}
          </h2>
        </div>
      </div>

      {/* ============================= */}
      {/* NOTIFICATIONS */}
      {/* ============================= */}

      <div className="relative" ref={notificationRef}>
        <button
          type="button"
          aria-label="Notifications"
          aria-expanded={isNotificationsOpen}
          aria-haspopup="dialog"
          onClick={() =>
            setIsNotificationsOpen((previous) => !previous)
          }
          className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
            isNotificationsOpen
              ? "border-primary bg-primary-soft text-primary"
              : "border-border bg-surface text-muted hover:bg-canvas hover:text-ink"
          }`}
        >
          <FontAwesomeIcon icon={faBell} />
        </button>

        {isNotificationsOpen && (
          <div
            role="dialog"
            aria-label="Notifications panel"
            className="absolute right-0 top-14 z-50 w-[min(320px,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-4 shadow-xl shadow-ink/10"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-ink">
                Notifications
              </h3>

              <button
                type="button"
                aria-label="Close notifications"
                onClick={() => setIsNotificationsOpen(false)}
                className="rounded-lg p-2 text-muted transition-colors hover:bg-canvas hover:text-primary"
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>

            <div className="flex flex-col items-center py-7 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
                <FontAwesomeIcon icon={faBell} />
              </div>

              <p className="mt-3 text-sm font-medium text-ink">
                You're all caught up
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                Notifications about forecasts and risk analyses will
                appear here when available.
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
