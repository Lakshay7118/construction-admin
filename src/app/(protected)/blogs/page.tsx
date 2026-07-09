"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Newspaper, RefreshCw } from "lucide-react";
import { useAdminData } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Badge from "@/components/Badge";

export default function BlogsPage() {
  const { blogs, removeBlog, refresh, ready } = useAdminData();
  const { showToast } = useToast();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
      showToast("Journal posts refreshed");
    } catch (err) {
      showToast("Failed to refresh posts");
    } finally {
      setRefreshing(false);
    }
  };

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Journal"
        description="Articles published on the public /blogs section."
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
            <Link href="/blogs/new" className="inline-flex items-center gap-2 bg-charcoal text-concrete px-4 py-2.5 text-sm font-medium hover:bg-safety transition-colors">
              <Plus size={16} /> New post
            </Link>
          </div>
        }
      />

      {blogs.length === 0 ? (
        <EmptyState icon={Newspaper} title="No posts yet" />
      ) : (
        <div className="bg-white border border-charcoal/12 rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal/12 text-left text-xs font-mono uppercase tracking-wide text-charcoal/45">
                <th className="px-5 py-3 font-medium">Post</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Author</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/8">
              {blogs.map((b) => (
                <tr key={b.slug} className="hover:bg-charcoal/[0.02]">
                  <td className="px-5 py-3.5">
                    <div className="font-medium max-w-xs truncate">{b.title}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone="blueprint">{b.category}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-charcoal/70">{b.author}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-charcoal/55">{b.date}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/blogs/${b.slug}`} className="p-2 text-charcoal/50 hover:text-blueprint transition-colors" aria-label={`Edit ${b.title}`}>
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => setPendingDelete(b.slug)} className="p-2 text-charcoal/50 hover:text-safety-dim transition-colors" aria-label={`Delete ${b.title}`}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this post?"
        description="It will be removed from the public journal section."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            removeBlog(pendingDelete);
            showToast("Post deleted");
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
