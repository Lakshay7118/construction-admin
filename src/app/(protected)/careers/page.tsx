"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Briefcase, MapPin } from "lucide-react";
import { useAdminData, type JobApplication } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Badge from "@/components/Badge";
import { Select } from "@/components/admin/Field";

const appStatusTone: Record<JobApplication["status"], "safety" | "warn" | "ok" | "neutral"> = {
  new: "safety",
  shortlisted: "warn",
  hired: "ok",
  rejected: "neutral",
};

export default function CareersPage() {
  const { careers, applications, removeCareer, updateApplicationStatus, ready } = useAdminData();
  const { showToast } = useToast();
  const [tab, setTab] = useState<"roles" | "applicants">("roles");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Careers"
        description="Open roles on the public careers page, and applicants who've applied."
        action={
          tab === "roles" ? (
            <Link href="/careers/new" className="inline-flex items-center gap-2 bg-charcoal text-concrete px-4 py-2.5 text-sm font-medium hover:bg-safety transition-colors">
              <Plus size={16} /> New role
            </Link>
          ) : undefined
        }
      />

      <div className="flex gap-1 mb-5 border-b border-charcoal/12">
        {(["roles", "applicants"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t ? "border-safety text-charcoal" : "border-transparent text-charcoal/50 hover:text-charcoal"
            }`}
          >
            {t === "roles" ? `Open roles (${careers.length})` : `Applicants (${applications.length})`}
          </button>
        ))}
      </div>

      {tab === "roles" ? (
        careers.length === 0 ? (
          <EmptyState icon={Briefcase} title="No open roles" />
        ) : (
          <div className="flex flex-col gap-3">
            {careers.map((c) => (
              <div key={c.slug} className="flex items-start gap-4 bg-white border border-charcoal/12 rounded-sm p-4">
                <div className="flex-1 min-w-0">
                  <div className="font-display text-base mb-1">{c.title}</div>
                  <div className="flex items-center gap-3 text-xs text-charcoal/50 mb-2 font-mono">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} /> {c.location}
                    </span>
                    <span>{c.type}</span>
                  </div>
                  <p className="text-sm text-charcoal/65 line-clamp-1">{c.description}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <Link href={`/careers/${c.slug}`} className="p-2 text-charcoal/50 hover:text-blueprint transition-colors" aria-label={`Edit ${c.title}`}>
                    <Pencil size={16} />
                  </Link>
                  <button onClick={() => setPendingDelete(c.slug)} className="p-2 text-charcoal/50 hover:text-safety-dim transition-colors" aria-label={`Delete ${c.title}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : applications.length === 0 ? (
        <EmptyState icon={Briefcase} title="No applicants yet" />
      ) : (
        <div className="bg-white border border-charcoal/12 rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal/12 text-left text-xs font-mono uppercase tracking-wide text-charcoal/45">
                <th className="px-5 py-3 font-medium">Applicant</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/8">
              {applications.map((a) => (
                <tr key={a.id} className="hover:bg-charcoal/[0.02]">
                  <td className="px-5 py-3.5">
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-charcoal/45">{a.resumeFileName}</div>
                  </td>
                  <td className="px-5 py-3.5 text-charcoal/70">{a.roleTitle}</td>
                  <td className="px-5 py-3.5 text-charcoal/60 text-xs">
                    <div>{a.email}</div>
                    <div>{a.phone}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Select
                      value={a.status}
                      onChange={(e) => {
                        updateApplicationStatus(a.id, e.target.value as JobApplication["status"]);
                        showToast("Applicant status updated");
                      }}
                      className="!w-auto !py-1.5 !text-xs"
                    >
                      <option value="new">New</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this role?"
        description="It will be removed from the public careers page."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            removeCareer(pendingDelete);
            showToast("Role deleted");
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
