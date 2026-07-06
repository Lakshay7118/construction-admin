"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { useAuth } from "@/lib/auth";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/cities": "Cities",
  "/services": "Services",
  "/blogs": "Journal",
  "/careers": "Careers",
  "/testimonials": "Testimonials",
  "/awards": "Awards",
  "/inquiries": "Inquiries",
  "/settings": "Settings",
};

function titleFor(pathname: string) {
  const base = "/" + (pathname.split("/")[1] ?? "");
  if (titles[base]) {
    const isSub = pathname !== base;
    return isSub ? `${titles[base]}` : titles[base];
  }
  return "Admin";
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-concrete">
        <div className="font-mono text-xs tracking-[0.2em] text-charcoal/40 uppercase">Loading…</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-concrete">
      <aside className="hidden lg:block w-64 shrink-0 h-full">
        <Sidebar />
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/50" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[80%]">
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Topbar title={titleFor(pathname ?? "")} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto scroll-thin">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
