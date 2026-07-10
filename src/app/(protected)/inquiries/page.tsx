"use client";

import { useEffect, useMemo, useState } from "react";
import { Inbox, Trash2, X, Mail, Phone, MapPin, Wallet, RefreshCw } from "lucide-react";
import { useAdminData, type Inquiry, type InquiryStatus } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Badge from "@/components/Badge";
import { Select } from "@/components/admin/Field";

const statusTone: Record<InquiryStatus, "safety" | "warn" | "ok"> = {
  new: "safety",
  "in-progress": "warn",
  closed: "ok",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function InquiriesPage() {
  const { inquiries, updateInquiryStatus, removeInquiry, refresh, ready } = useAdminData();
  const { showToast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to page 1 when status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
      showToast("Inquiries refreshed");
      setCurrentPage(1);
    } catch (err) {
      showToast("Failed to refresh inquiries");
    } finally {
      setRefreshing(false);
    }
  };

  const filtered = useMemo(
    () => inquiries.filter((i) => statusFilter === "all" || i.status === statusFilter).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [inquiries, statusFilter]
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedInquiries = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Leads"
        title="Inquiries"
        description="Submissions from the quote request and contact forms."
        action={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 border border-charcoal/20 bg-white hover:bg-charcoal/[0.04] text-charcoal px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        }
      />

      <div className="flex gap-2 mb-5">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-48">
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="in-progress">In progress</option>
          <option value="closed">Closed</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="No inquiries" description="Nothing matches this filter yet." />
      ) : (
        <div className="bg-white border border-charcoal/12 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/12 text-left text-xs font-mono uppercase tracking-wide text-charcoal/45">
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Project</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                  <th className="px-5 py-3 font-medium">Received</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/8">
                {paginatedInquiries.map((i) => (
                  <tr key={i.id} className="hover:bg-charcoal/[0.02] cursor-pointer" onClick={() => setSelected(i)}>
                    <td className="px-5 py-3.5">
                      <div className="font-medium">{i.name}</div>
                      <div className="text-xs text-charcoal/45">{i.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-charcoal/70">
                      {i.projectType} · {i.city}
                    </td>
                    <td className="px-5 py-3.5 text-charcoal/60 text-xs font-mono">{i.source}</td>
                    <td className="px-5 py-3.5 text-xs font-mono text-charcoal/55">{formatDate(i.createdAt)}</td>
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={i.status}
                        onChange={(e) => {
                          updateInquiryStatus(i.id, e.target.value as InquiryStatus);
                          showToast("Status updated");
                        }}
                        className="!w-auto !py-1.5 !text-xs"
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In progress</option>
                        <option value="closed">Closed</option>
                      </Select>
                    </td>
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end">
                        <button onClick={() => setPendingDelete(i.id)} className="p-2 text-charcoal/50 hover:text-safety-dim transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-charcoal/12 bg-charcoal/[0.01]">
              <div className="text-xs font-mono text-charcoal/50">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)}–
                {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
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
                  {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
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

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-charcoal/50" onClick={() => setSelected(null)} />
          <div className="relative bg-concrete w-full max-w-md h-full overflow-y-auto scroll-thin p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg">Inquiry detail</h3>
              <button onClick={() => setSelected(null)} className="p-1 text-charcoal/50 hover:text-charcoal">
                <X size={20} />
              </button>
            </div>

            <div className="mb-5">
              <div className="font-display text-xl mb-1">{selected.name}</div>
              <Badge tone={statusTone[selected.status]}>{selected.status.replace("-", " ")}</Badge>
            </div>

            <div className="flex flex-col gap-3 text-sm mb-6">
              <div className="flex items-center gap-2.5 text-charcoal/70">
                <Mail size={15} className="text-charcoal/40" /> {selected.email}
              </div>
              <div className="flex items-center gap-2.5 text-charcoal/70">
                <Phone size={15} className="text-charcoal/40" /> {selected.phone}
              </div>
              <div className="flex items-center gap-2.5 text-charcoal/70">
                <MapPin size={15} className="text-charcoal/40" /> {selected.city} · {selected.projectType}
              </div>
              <div className="flex items-center gap-2.5 text-charcoal/70">
                <Wallet size={15} className="text-charcoal/40" /> {selected.budget}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-xs font-mono uppercase tracking-wide text-charcoal/45 mb-2">Message</div>
              <p className="text-sm text-charcoal/75 leading-relaxed bg-white border border-charcoal/12 rounded-sm p-4">
                {selected.message}
              </p>
            </div>

            <div className="text-xs text-charcoal/45 font-mono mb-6">
              Received {formatDate(selected.createdAt)} via {selected.source}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Update status</span>
              <Select
                value={selected.status}
                onChange={(e) => {
                  const status = e.target.value as InquiryStatus;
                  updateInquiryStatus(selected.id, status);
                  setSelected({ ...selected, status });
                  showToast("Status updated");
                }}
              >
                <option value="new">New</option>
                <option value="in-progress">In progress</option>
                <option value="closed">Closed</option>
              </Select>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this inquiry?"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            removeInquiry(pendingDelete);
            showToast("Inquiry deleted");
            if (paginatedInquiries.length === 1 && currentPage > 1) {
              setCurrentPage((p) => p - 1);
            }
          }
          setPendingDelete(null);
          setSelected(null);
        }}
      />
    </div>
  );
}
