"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, ChevronDown, LogOut, RotateCcw } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useAdminData } from "@/lib/store";

export default function Topbar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  const { adminName, logout } = useAuth();
  const { resetToSeed } = useAdminData();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 h-16 px-4 sm:px-6 border-b border-charcoal/12 bg-concrete/95 backdrop-blur">
      <button className="lg:hidden p-2 -ml-2 text-charcoal" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>

      <h1 className="font-display text-lg sm:text-xl tracking-tight shrink-0">{title}</h1>

      <div className="hidden md:flex items-center flex-1 max-w-sm ml-6">
        <div className="relative w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search this section…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-charcoal/[0.04] border border-charcoal/12 rounded-sm focus:outline-none focus:border-safety focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => {
            if (confirm("Reset all mock data back to the seeded demo content? This clears any edits made in this session.")) {
              resetToSeed();
            }
          }}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase tracking-wide text-charcoal/60 hover:text-safety-dim transition-colors"
          title="Reset demo data"
        >
          <RotateCcw size={14} />
          Reset demo data
        </button>

        <button className="p-2 text-charcoal/60 hover:text-charcoal relative" aria-label="Notifications">
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-safety" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 pl-2 pr-1 py-1.5 rounded-sm hover:bg-charcoal/[0.05] transition-colors"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blueprint text-concrete text-xs font-mono font-medium">
              {adminName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <span className="hidden sm:block text-sm font-medium">{adminName}</span>
            <ChevronDown size={14} className="text-charcoal/50" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-charcoal/12 rounded-sm shadow-lg z-20 py-1">
                <div className="px-3 py-2 border-b border-charcoal/10">
                  <div className="text-sm font-medium">{adminName}</div>
                  <div className="text-xs text-charcoal/50">Super Admin</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-safety-dim hover:bg-safety/5 transition-colors"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
