"use client";

import Link from "next/link";
import {
  Building2,
  MapPinned,
  Inbox,
  Briefcase,
  ArrowUpRight,
  Wrench,
} from "lucide-react";
import { useAdminData } from "@/lib/store";
import Badge from "@/components/Badge";
import PageHeader from "@/components/admin/PageHeader";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative bg-white border border-charcoal/12 rounded-sm p-5 hover:border-safety/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-6">
        <span className="flex h-9 w-9 items-center justify-center bg-blueprint/8 text-blueprint rounded-sm">
          <Icon size={18} />
        </span>
        <ArrowUpRight
          size={16}
          className="text-charcoal/25 group-hover:text-safety-dim transition-colors"
        />
      </div>
      <div className="font-display text-3xl leading-none mb-1.5">{value}</div>
      <div className="text-sm text-charcoal/60">{label}</div>
      {sub && <div className="mt-2 text-xs font-mono text-charcoal/40">{sub}</div>}
    </Link>
  );
}

const statusTone: Record<string, "safety" | "warn" | "ok"> = {
  new: "safety",
  "in-progress": "warn",
  closed: "ok",
};

export default function DashboardPage() {
  const { projects, cities, services, inquiries, careers, applications, ready } = useAdminData();

  if (!ready) return null;

  const ongoing = projects.filter((p) => p.status === "ongoing").length;
  const completed = projects.filter((p) => p.status === "completed").length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const recentInquiries = [...inquiries]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);
  const recentApplications = [...applications]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Good to see you, Meera"
        description="Here's what's moving across the site content and inbound leads today."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Building2} label="Total projects" value={projects.length} sub={`${ongoing} ongoing · ${completed} completed`} href="/projects" />
        <StatCard icon={MapPinned} label="Active cities" value={cities.length} sub="Market coverage" href="/cities" />
        <StatCard icon={Inbox} label="New inquiries" value={newInquiries} sub={`${inquiries.length} total`} href="/inquiries" />
        <StatCard icon={Briefcase} label="Open roles" value={careers.length} sub={`${applications.length} applicants`} href="/careers" />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white border border-charcoal/12 rounded-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal/10">
            <h3 className="font-display text-base">Recent inquiries</h3>
            <Link href="/inquiries" className="text-xs font-mono uppercase tracking-wide text-safety-dim hover:text-safety">
              View all
            </Link>
          </div>
          <div className="divide-y divide-charcoal/8">
            {recentInquiries.map((inq) => (
              <div key={inq.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{inq.name}</div>
                  <div className="text-xs text-charcoal/50 truncate">
                    {inq.projectType} · {inq.city}
                  </div>
                </div>
                <Badge tone={statusTone[inq.status]}>{inq.status.replace("-", " ")}</Badge>
              </div>
            ))}
            {recentInquiries.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-charcoal/50">No inquiries yet.</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-charcoal/12 rounded-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal/10">
            <h3 className="font-display text-base">Latest applicants</h3>
            <Link href="/careers" className="text-xs font-mono uppercase tracking-wide text-safety-dim hover:text-safety">
              View all
            </Link>
          </div>
          <div className="divide-y divide-charcoal/8">
            {recentApplications.map((app) => (
              <div key={app.id} className="px-5 py-3.5">
                <div className="text-sm font-medium truncate">{app.name}</div>
                <div className="text-xs text-charcoal/50 truncate">{app.roleTitle}</div>
              </div>
            ))}
            {recentApplications.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-charcoal/50">No applicants yet.</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blueprint text-concrete rounded-sm p-6 blueprint-grid-fine relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blueprint-deep/60 to-transparent" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-safety mb-2">
              <Wrench size={13} /> SERVICES
            </div>
            <h3 className="font-display text-xl">{services.length} service lines published on the public site</h3>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-safety text-charcoal px-4 py-2.5 text-sm font-medium hover:bg-concrete transition-colors shrink-0"
          >
            Manage services
          </Link>
        </div>
      </div>
    </div>
  );
}
