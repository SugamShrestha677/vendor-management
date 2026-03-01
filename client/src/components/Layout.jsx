import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import NotificationContainer from './NotificationContainer';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Close sidebar on mobile after navigation
  const closeSidebarMobile = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      <Sidebar open={sidebarOpen} onLinkClick={closeSidebarMobile} />

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>

      <NotificationContainer />
    </div>
  );
}