import { useState } from "react";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import AppRoutes from "./routes/AppRoutes";

/* ============================= */
/* MAIN APPLICATION */
/* ============================= */

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="min-h-screen lg:pl-64">
        <Header setIsOpen={setIsOpen} />

        <main className="p-4 py-8 sm:p-8">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}