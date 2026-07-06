"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Building2,
  MapPinned,
  Wrench,
  Newspaper,
  Briefcase,
  Quote,
  Award as AwardIcon,
  Inbox,
  Settings,
  X,
} from "lucide-react";

const navGroups = [
  {
    label: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutGrid }],
  },
  {
    label: "Content",
    items: [
      { href: "/projects", label: "Projects", icon: Building2 },
      { href: "/cities", label: "Cities", icon: MapPinned },
      { href: "/services", label: "Services", icon: Wrench },
      { href: "/blogs", label: "Journal", icon: Newspaper },
      { href: "/careers", label: "Careers", icon: Briefcase },
      { href: "/testimonials", label: "Testimonials", icon: Quote },
      { href: "/awards", label: "Awards", icon: AwardIcon },
    ],
  },
  {
    label: "Leads",
    items: [{ href: "/inquiries", label: "Inquiries", icon: Inbox }],
  },
  {
    label: "System",
    items: [{ href: "/settings", label: "Settings", icon: Settings }],
  },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-blueprint-deep text-concrete">
      <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onNavigate}>
          <span className="flex h-9 w-9 items-center justify-center border-2 border-safety text-safety font-mono text-xs font-medium">
            KC
          </span>
          <span className="font-display text-sm tracking-tight leading-none">
            KALPATARU
            <span className="block text-[9px] font-body font-medium tracking-[0.25em] text-concrete/50">
              ADMIN PANEL
            </span>
          </span>
        </Link>
        <button className="lg:hidden p-1 text-concrete/60" onClick={onNavigate} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto scroll-thin px-3 py-5">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <div className="px-3 mb-2 font-mono text-[10px] tracking-[0.2em] text-concrete/35 uppercase">
              {group.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-sm transition-colors relative ${
                      active
                        ? "bg-white/[0.06] text-concrete"
                        : "text-concrete/60 hover:text-concrete hover:bg-white/[0.04]"
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-1.5 bottom-1.5 w-0.5 ${active ? "bg-safety" : "bg-transparent"}`}
                    />
                    <Icon size={17} strokeWidth={2} className={active ? "text-safety" : ""} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-white/10 shrink-0">
        <div className="font-mono text-[10px] text-concrete/35 tracking-wide">v0.1.0 — frontend preview</div>
      </div>
    </div>
  );
}
