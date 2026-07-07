"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, ChevronDown, LogOut, Inbox, Briefcase } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useAdminData } from "@/lib/store";

export default function Topbar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  const { adminName, logout } = useAuth();
  const { inquiries, applications, refresh } = useAdminData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const router = useRouter();

  const notifications = useMemo(() => {
    const newInquiries = inquiries
      .filter((item) => item.status === "new")
      .map((item) => ({
        id: `inquiry-${item.id}`,
        type: "Inquiry",
        title: item.name,
        detail: `${item.projectType} in ${item.city}`,
        createdAt: item.createdAt,
        href: "/inquiries",
        icon: Inbox,
      }));

    const newApplications = applications
      .filter((item) => item.status === "new")
      .map((item) => ({
        id: `application-${item.id}`,
        type: "Career",
        title: item.name,
        detail: item.roleTitle,
        createdAt: item.createdAt,
        href: "/careers",
        icon: Briefcase,
      }));

    return [...newInquiries, ...newApplications].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  }, [applications, inquiries]);

  const notificationCount = notifications.length;

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function openNotification(href: string) {
    setNotificationsOpen(false);
    router.push(href);
  }

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
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen((v) => !v)}
            className="p-2 text-charcoal/60 hover:text-charcoal relative"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell size={19} />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-safety text-concrete text-[10px] font-mono leading-4 text-center">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-charcoal/12 rounded-sm shadow-lg z-20 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-charcoal/10">
                  <div>
                    <div className="text-sm font-medium">Notifications</div>
                    <div className="text-xs text-charcoal/50">
                      {notificationCount ? `${notificationCount} new item${notificationCount === 1 ? "" : "s"}` : "All caught up"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void refresh()}
                    className="text-xs font-mono uppercase tracking-wide text-blueprint hover:text-safety-dim"
                  >
                    Refresh
                  </button>
                </div>
                {notificationCount === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-charcoal/50">No new inquiries or applicants.</div>
                ) : (
                  <div className="max-h-96 overflow-y-auto scroll-thin divide-y divide-charcoal/8">
                    {notifications.slice(0, 8).map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => openNotification(item.href)}
                          className="w-full flex gap-3 px-4 py-3 text-left hover:bg-charcoal/[0.03] transition-colors"
                        >
                          <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-safety/10 text-safety-dim shrink-0">
                            <Icon size={15} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-xs font-mono uppercase tracking-wide text-charcoal/45">{item.type}</span>
                            <span className="block text-sm font-medium truncate">{item.title}</span>
                            <span className="block text-xs text-charcoal/55 truncate">{item.detail}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

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
