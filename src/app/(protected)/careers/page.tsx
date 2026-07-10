"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  MapPin,
  X,
  Mail,
  Phone,
  FileText,
  Download,
  ExternalLink,
  MessageSquare,
  User,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useAdminData, type JobApplication } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Badge from "@/components/Badge";
import { Select } from "@/components/admin/Field";

const appStatusTone: Record<
  JobApplication["status"],
  "safety" | "warn" | "ok" | "neutral"
> = {
  new: "safety",
  shortlisted: "warn",
  hired: "ok",
  rejected: "neutral",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function CareersPage() {
  const { careers, applications, removeCareer, updateApplicationStatus, refresh, ready } =
    useAdminData();
  const { showToast } = useToast();
  const [tab, setTab] = useState<"roles" | "applicants">("roles");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [selected, setSelected] = useState<JobApplication | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to page 1 when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [tab]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
      showToast("Careers data refreshed");
      setCurrentPage(1);
    } catch (err) {
      showToast("Failed to refresh careers");
    } finally {
      setRefreshing(false);
    }
  };

  // Keep the selected application in sync when status is updated
  const selectedSynced = useMemo(() => {
    if (!selected) return null;
    return applications.find((a) => a.id === selected.id) ?? null;
  }, [applications, selected]);

  const totalRolesPages = Math.ceil(careers.length / itemsPerPage);
  const paginatedCareers = careers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalApplicantsPages = Math.ceil(applications.length / itemsPerPage);
  const paginatedApplications = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Careers"
        description="Open roles on the public careers page, and applicants who've applied."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 border border-charcoal/20 bg-white hover:bg-charcoal/[0.04] text-charcoal px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            {tab === "roles" && (
              <Link
                href="/careers/new"
                className="inline-flex items-center gap-2 bg-charcoal text-concrete px-4 py-2.5 text-sm font-medium hover:bg-safety transition-colors"
              >
                <Plus size={16} /> New role
              </Link>
            )}
          </div>
        }
      />

      <div className="flex gap-1 mb-5 border-b border-charcoal/12">
        {(["roles", "applicants"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? "border-safety text-charcoal"
                : "border-transparent text-charcoal/50 hover:text-charcoal"
            }`}
          >
            {t === "roles"
              ? `Open roles (${careers.length})`
              : `Applicants (${applications.length})`}
          </button>
        ))}
      </div>

      {tab === "roles" ? (
        careers.length === 0 ? (
          <EmptyState icon={Briefcase} title="No open roles" />
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              {paginatedCareers.map((c) => (
                <div
                  key={c.slug}
                  className="flex items-start gap-4 bg-white border border-charcoal/12 rounded-sm p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-base mb-1">{c.title}</div>
                    <div className="flex items-center gap-3 text-xs text-charcoal/50 mb-2 font-mono">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} /> {c.location}
                      </span>
                      <span>{c.type}</span>
                    </div>
                    <p className="text-sm text-charcoal/65 line-clamp-1">
                      {c.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <Link
                      href={`/careers/${c.slug}`}
                      className="p-2 text-charcoal/50 hover:text-blueprint transition-colors"
                      aria-label={`Edit ${c.title}`}
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => setPendingDelete(c.slug)}
                      className="p-2 text-charcoal/50 hover:text-safety-dim transition-colors"
                      aria-label={`Delete ${c.title}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination for Roles */}
            {totalRolesPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border border-charcoal/12 bg-white rounded-sm">
                <div className="text-xs font-mono text-charcoal/50">
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, careers.length)}–
                  {Math.min(currentPage * itemsPerPage, careers.length)} of {careers.length} entries
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-3 py-1.5 text-xs font-medium border border-charcoal/15 bg-white hover:bg-charcoal/[0.04] transition-colors disabled:opacity-40 disabled:hover:bg-white"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-mono text-charcoal/60 px-2">
                    {currentPage} of {totalRolesPages}
                  </span>
                  <button
                    disabled={currentPage === totalRolesPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1.5 text-xs font-medium border border-charcoal/15 bg-white hover:bg-charcoal/[0.04] transition-colors disabled:opacity-40 disabled:hover:bg-white"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      ) : applications.length === 0 ? (
        <EmptyState icon={Briefcase} title="No applicants yet" />
      ) : (
        <div className="bg-white border border-charcoal/12 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
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
                {paginatedApplications.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-charcoal/[0.02] cursor-pointer transition-colors"
                    onClick={() => setSelected(a)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-blueprint hover:underline">
                        {a.name}
                      </div>
                      <div className="text-xs text-charcoal/45 mt-0.5 flex items-center gap-1">
                        <FileText size={11} />
                        {a.resumeFileName}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-charcoal/70">{a.roleTitle}</td>
                    <td className="px-5 py-3.5 text-charcoal/60 text-xs">
                      <div>{a.email}</div>
                      <div>{a.phone}</div>
                    </td>
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={a.status}
                        onChange={(e) => {
                          updateApplicationStatus(
                            a.id,
                            e.target.value as JobApplication["status"]
                          );
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

          {/* Pagination for Applicants */}
          {totalApplicantsPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-charcoal/12 bg-charcoal/[0.01]">
              <div className="text-xs font-mono text-charcoal/50">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, applications.length)}–
                {Math.min(currentPage * itemsPerPage, applications.length)} of {applications.length} entries
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1.5 text-xs font-medium border border-charcoal/15 bg-white hover:bg-charcoal/[0.04] transition-colors disabled:opacity-40 disabled:hover:bg-white"
                >
                  Previous
                </button>
                <span className="text-xs font-mono text-charcoal/60 px-2">
                  {currentPage} of {totalApplicantsPages}
                </span>
                <button
                  disabled={currentPage === totalApplicantsPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1.5 text-xs font-medium border border-charcoal/15 bg-white hover:bg-charcoal/[0.04] transition-colors disabled:opacity-40 disabled:hover:bg-white"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}


      {/* ── Applicant Detail Right Panel ── */}
      {selectedSynced && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-charcoal/50"
            onClick={() => setSelected(null)}
          />

          {/* Panel */}
          <div className="relative bg-concrete w-full max-w-md h-full overflow-y-auto scroll-thin p-6 shadow-xl flex flex-col gap-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg">Application detail</h3>
              <button
                onClick={() => setSelected(null)}
                className="p-1 text-charcoal/50 hover:text-charcoal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Name + badge */}
            <div className="mb-5">
              <div className="font-display text-xl mb-2">
                {selectedSynced.name}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge tone={appStatusTone[selectedSynced.status]}>
                  {selectedSynced.status}
                </Badge>
                <span className="text-xs font-mono text-charcoal/45 bg-charcoal/[0.05] border border-charcoal/10 px-2 py-0.5 rounded-sm">
                  {selectedSynced.roleTitle}
                </span>
              </div>
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-3 text-sm mb-6">
              <div className="flex items-center gap-2.5 text-charcoal/70">
                <Mail size={15} className="text-charcoal/40 shrink-0" />
                <a
                  href={`mailto:${selectedSynced.email}`}
                  className="hover:text-blueprint transition-colors truncate"
                >
                  {selectedSynced.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-charcoal/70">
                <Phone size={15} className="text-charcoal/40 shrink-0" />
                <a
                  href={`tel:${selectedSynced.phone}`}
                  className="hover:text-blueprint transition-colors"
                >
                  {selectedSynced.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-charcoal/70">
                <User size={15} className="text-charcoal/40 shrink-0" />
                Applying for:{" "}
                <span className="font-medium text-charcoal">
                  {selectedSynced.roleTitle}
                </span>
              </div>
              {selectedSynced.createdAt && (
                <div className="flex items-center gap-2.5 text-charcoal/50 text-xs font-mono">
                  <Clock size={13} className="text-charcoal/35 shrink-0" />
                  Applied {formatDate(selectedSynced.createdAt)}
                </div>
              )}
            </div>

            {/* Resume / Document */}
            <div className="mb-6">
              <div className="text-xs font-mono uppercase tracking-wide text-charcoal/45 mb-2">
                Resume / Document
              </div>
              {selectedSynced.resumeUrl ? (() => {
                const fname  = selectedSynced.resumeFileName ?? "";
                const ext    = fname.split(".").pop()?.toLowerCase() ?? "";
                const isPdf  = ext === "pdf";

                // Build a Cloudinary fl_attachment URL to force download
                const dlUrl = selectedSynced.resumeUrl.replace(
                  "/raw/upload/",
                  "/raw/upload/fl_attachment/"
                );

                return (
                  <div className="bg-white border border-charcoal/12 rounded-sm p-4 flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blueprint/10 rounded-sm flex items-center justify-center">
                      <FileText size={18} className="text-blueprint" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-charcoal truncate mb-0.5">
                        {fname}
                      </div>
                      <div className="text-xs text-charcoal/45 font-mono mb-3 flex items-center gap-1.5">
                        <span className="uppercase bg-blueprint/10 text-blueprint px-1.5 py-0.5 rounded-sm font-bold">
                          {ext || "file"}
                        </span>
                        Uploaded to Cloudinary
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {isPdf ? (
                          /* PDF → open inline in browser */
                          <a
                            href={selectedSynced.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-blueprint hover:text-safety-dim transition-colors border border-blueprint/20 bg-blueprint/5 px-3 py-1.5 rounded-sm"
                          >
                            <ExternalLink size={12} /> View PDF
                          </a>
                        ) : (
                          /* DOCX / DOC → can't view inline, show info */
                          <span className="inline-flex items-center gap-1.5 text-xs text-charcoal/45 italic">
                            <ExternalLink size={11} /> Preview not available for {ext.toUpperCase()} files
                          </span>
                        )}

                        {/* Download — always show, forces correct filename via fl_attachment */}
                        <a
                          href={dlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal hover:text-safety-dim transition-colors border border-charcoal/15 bg-charcoal/[0.04] px-3 py-1.5 rounded-sm"
                        >
                          <Download size={12} /> Download
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="bg-white border border-charcoal/12 rounded-sm p-4 flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-charcoal/[0.04] rounded-sm flex items-center justify-center">
                    <FileText size={18} className="text-charcoal/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-charcoal/70 truncate">
                      {selectedSynced.resumeFileName || "No document uploaded"}
                    </div>
                    <div className="text-xs text-charcoal/40 mt-0.5">
                      Document URL not available (submitted without Cloudinary
                      upload)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cover Note */}
            {selectedSynced.coverNote && (
              <div className="mb-6">
                <div className="text-xs font-mono uppercase tracking-wide text-charcoal/45 mb-2 flex items-center gap-1.5">
                  <MessageSquare size={12} /> Cover note
                </div>
                <p className="text-sm text-charcoal/75 leading-relaxed bg-white border border-charcoal/12 rounded-sm p-4 whitespace-pre-line">
                  {selectedSynced.coverNote}
                </p>
              </div>
            )}

            {/* Update Status */}
            <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-charcoal/10">
              <span className="text-sm font-medium">Update status</span>
              <Select
                value={selectedSynced.status}
                onChange={(e) => {
                  const status = e.target.value as JobApplication["status"];
                  updateApplicationStatus(selectedSynced.id, status);
                  showToast("Applicant status updated");
                }}
              >
                <option value="new">New</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>
          </div>
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
            if (paginatedCareers.length === 1 && currentPage > 1) {
              setCurrentPage((p) => p - 1);
            }
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
