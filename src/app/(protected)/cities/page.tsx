"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, MapPinned } from "lucide-react";
import { useAdminData } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function CitiesPage() {
  const { cities, projects, removeCity, ready } = useAdminData();
  const { showToast } = useToast();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Cities"
        description="Markets shown on the public projects page, each with their own city landing page."
        action={
          <Link href="/cities/new" className="inline-flex items-center gap-2 bg-charcoal text-concrete px-4 py-2.5 text-sm font-medium hover:bg-safety transition-colors">
            <Plus size={16} /> New city
          </Link>
        }
      />

      {cities.length === 0 ? (
        <EmptyState icon={MapPinned} title="No cities yet" description="Add a city to start listing projects there." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map((city) => {
            const count = projects.filter((p) => p.citySlug === city.slug).length;
            return (
              <div key={city.slug} className="bg-white border border-charcoal/12 rounded-sm overflow-hidden group">
                <div
                  className="h-28 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${city.coverImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                  <div className="absolute bottom-2.5 left-3.5 text-concrete font-display text-lg">{city.name}</div>
                </div>
                <div className="p-4">
                  <div className="text-xs font-mono text-charcoal/45 mb-2">
                    {city.state} · {count} project{count === 1 ? "" : "s"} · {city.totalSqft}L sq.ft
                  </div>
                  <p className="text-sm text-charcoal/65 line-clamp-2 mb-3">{city.description}</p>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/cities/${city.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-charcoal/20 hover:bg-charcoal/[0.04] transition-colors"
                    >
                      <Pencil size={13} /> Edit
                    </Link>
                    <button
                      onClick={() => setPendingDelete(city.slug)}
                      className="p-2 text-charcoal/45 hover:text-safety-dim transition-colors"
                      aria-label={`Delete ${city.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this city?"
        description="Projects assigned to this city will remain but lose their city page link."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            removeCity(pendingDelete);
            showToast("City deleted");
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
