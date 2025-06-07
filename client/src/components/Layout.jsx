import React, { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-[#1A1A2E] text-white p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
