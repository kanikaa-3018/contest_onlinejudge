import React, { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(true)} />
        {/* CORRECTED: Removed hardcoded colors. Now uses theme variables from index.css */}
        <main className="flex-1 overflow-y-auto bg-background text-foreground p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;