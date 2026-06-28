import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050816] text-[#F8FAFC] relative overflow-hidden">
      {/* Aurora Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#00D4FF]/10 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-1/3 left-10 w-[600px] h-[600px] bg-[#8B5CF6]/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Sidebar Nav */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 md:px-8 md:py-8 lg:h-screen lg:overflow-y-auto relative z-10">
        <div className="max-w-6xl mx-auto space-y-6">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default Layout;
