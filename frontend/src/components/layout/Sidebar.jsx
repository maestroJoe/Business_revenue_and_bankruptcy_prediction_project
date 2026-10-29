
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  faGaugeHigh,
  faChartLine,
  faShieldHalved,
  faBuilding,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

/* ============================= */
/* NAVIGATION ITEMS */
/* ============================= */

const navigationItems = [
  { label: "Overview", path: "/", icon: faGaugeHigh },
  {
    label: "Revenue Forecast",
    path: "/revenue-forecast",
    icon: faChartLine,
  },
  {
    label: "Bankruptcy Risk",
    path: "/bankruptcy-risk",
    icon: faShieldHalved,
  },
];

/* ============================= */
/* SIDEBAR */
/* ============================= */

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isSettingsActive = pathname === "/settings";

  /* ============================= */
  /* NAVIGATION HANDLERS */
  /* ============================= */

  function handleNavigation() {
    setIsOpen(false);
  }

  function renderNavItem(item) {
    return (
      <NavLink
        key={item.label}
        to={item.path}
        end={item.path === "/"}
        onClick={handleNavigation}
        className={({ isActive }) =>
          `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
            isActive
              ? "bg-primary-soft font-semibold text-primary"
              : "text-muted hover:bg-canvas hover:text-ink"
          }`
        }
      >
        <FontAwesomeIcon icon={item.icon} className="w-5" />
        {item.label}
      </NavLink>
    );
  }

  return (
    <>
      {/* ============================= */}
      {/* MOBILE OVERLAY */}
      {/* ============================= */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ============================= */}
      {/* SIDEBAR */}
      {/* ============================= */}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface p-5 transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* ============================= */}
        {/* BRAND */}
        {/* ============================= */}

        <button
          type="button"
          onClick={() => {
            navigate("/");
            handleNavigation();
          }}
          aria-label="FinGuard AI home"
          className="flex items-center gap-3 rounded-xl px-2 py-4 text-left"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <FontAwesomeIcon icon={faBuilding} size="lg" />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-ink">
              FinGuard AI
            </h1>
            <p className="text-xs text-muted">
              Financial Intelligence
            </p>
          </div>
        </button>

        {/* ============================= */}
        {/* WORKSPACE NAVIGATION */}
        {/* ============================= */}

        <div className="mt-9">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-muted">
            Workspace
          </p>

          <nav className="space-y-1" aria-label="Main navigation">
            {navigationItems.map(renderNavItem)}
          </nav>
        </div>

        {/* ============================= */}
        {/* SETTINGS */}
        {/* ============================= */}

        <div className="mt-auto border-t border-border pt-5">
          <NavLink
            to="/settings"
            onClick={handleNavigation}
            className={() =>
              `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                isSettingsActive
                  ? "bg-primary-soft font-semibold text-primary"
                  : "text-muted hover:bg-canvas hover:text-ink"
              }`
            }
          >
            <FontAwesomeIcon icon={faGear} className="w-5" />
            Settings
          </NavLink>

          <div className="mt-4 rounded-xl border border-border bg-canvas p-4">
            <p className="text-sm font-semibold text-ink">
              FinGuard AI
            </p>
            <p className="mt-1 text-xs text-muted">
              Student project · MVP
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
