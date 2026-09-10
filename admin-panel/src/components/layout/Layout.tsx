import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] text-[#171A18] relative overflow-x-hidden">
      <Sidebar isMobileOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-[#FAF9F6]">
          {children}
        </main>
      </div>
    </div>
  );
};

