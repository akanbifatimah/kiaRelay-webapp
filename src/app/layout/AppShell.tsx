import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";

// TODO: replace hardcoded user with the authenticated admin session once
// login/MFA (ADM-AUTH) is built.
export function AppShell() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeader
          userName="Alex Mercer"
          userRole="Fleet Admin"
          userAvatarSrc="/profile_img.png"
          onOpenNav={() => setIsMobileNavOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
