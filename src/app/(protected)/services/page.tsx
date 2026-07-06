"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Wrench } from "lucide-react";
import { useAdminData } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function ServicesPage() {
  const { services, removeService, ready } = useAdminData();
  const { showToast } = useToast();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Services"
        description="The service lines listed on the public services page."
        action={
          <Link href="/services/new" className="inline-flex items-center gap-2 bg-charcoal text-concrete px-4 py-2.5 text-sm font-medium hover:bg-safety transition-colors">
            <Plus size={16} /> New service
          </Link>
        }
      />

      {services.length === 0 ? (
        <EmptyState icon={Wrench} title="No services yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {services.map((s) => (
            <div key={s.slug} className="flex gap-4 bg-white border border-charcoal/12 rounded-sm p-4">
              <div
                className="hidden sm:block w-28 h-20 shrink-0 bg-cover bg-center rounded-sm"
                style={{ backgroundImage: `url(${s.image})` }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-display text-base mb-0.5">{s.name}</div>
                <p className="text-sm text-charcoal/60 line-clamp-1 mb-2">{s.tagline}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.capabilities.slice(0, 3).map((c) => (
                    <span key={c} className="text-[11px] font-mono bg-charcoal/[0.05] px-2 py-0.5 rounded-sm text-charcoal/55">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <Link href={`/services/${s.slug}`} className="p-2 text-charcoal/50 hover:text-blueprint transition-colors" aria-label={`Edit ${s.name}`}>
                  <Pencil size={16} />
                </Link>
                <button onClick={() => setPendingDelete(s.slug)} className="p-2 text-charcoal/50 hover:text-safety-dim transition-colors" aria-label={`Delete ${s.name}`}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this service?"
        description="It will be removed from the public services page."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            removeService(pendingDelete);
            showToast("Service deleted");
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
