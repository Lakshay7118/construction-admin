"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Building2, Search, RefreshCw } from "lucide-react";
import { useAdminData } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/Badge";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Select } from "@/components/admin/Field";

export default function ProjectsPage() {
  const { projects, cities, removeProject, refresh, ready } = useAdminData();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
      showToast("Projects refreshed");
    } catch (err) {
      showToast("Failed to refresh projects");
    } finally {
      setRefreshing(false);
    }
  };

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase());
      const matchesCity = cityFilter === "all" || p.citySlug === cityFilter;
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesQuery && matchesCity && matchesStatus;
    });
  }, [projects, query, cityFilter, statusFilter]);

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Projects"
        description="Every project shown on the public projects page and city pages."
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
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 bg-charcoal text-concrete px-4 py-2.5 text-sm font-medium hover:bg-safety transition-colors"
            >
              <Plus size={16} /> New project
            </Link>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects by title…"
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-charcoal/15 rounded-sm focus:outline-none focus:border-safety"
          />
        </div>
        <Select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="sm:w-48">
          <option value="all">All cities</option>
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-44">
          <option value="all">All statuses</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No projects found"
          description="Try a different search or filter, or add a new project."
          action={
            <Link href="/projects/new" className="inline-flex items-center gap-2 bg-charcoal text-concrete px-4 py-2 text-sm font-medium hover:bg-safety transition-colors">
              <Plus size={15} /> New project
            </Link>
          }
        />
      ) : (
        <div className="bg-white border border-charcoal/12 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal/12 text-left text-xs font-mono uppercase tracking-wide text-charcoal/45">
                  <th className="px-5 py-3 font-medium">Project</th>
                  <th className="px-5 py-3 font-medium">City</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Sq.ft</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/8">
                {filtered.map((p) => {
                  const city = cities.find((c) => c.slug === p.citySlug);
                  return (
                    <tr key={p.slug} className="hover:bg-charcoal/[0.02]">
                      <td className="px-5 py-3.5">
                        <div className="font-medium">{p.title}</div>
                        <div className="text-xs text-charcoal/45 font-mono">{p.year}</div>
                      </td>
                      <td className="px-5 py-3.5 text-charcoal/70">{city?.name ?? p.citySlug}</td>
                      <td className="px-5 py-3.5 text-charcoal/70">{p.type}</td>
                      <td className="px-5 py-3.5">
                        <Badge tone={p.status === "completed" ? "ok" : "warn"}>{p.status}</Badge>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-charcoal/70">{p.sqft.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/projects/${p.slug}`}
                            className="p-2 text-charcoal/50 hover:text-blueprint transition-colors"
                            aria-label={`Edit ${p.title}`}
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => setPendingDelete(p.slug)}
                            className="p-2 text-charcoal/50 hover:text-safety-dim transition-colors"
                            aria-label={`Delete ${p.title}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this project?"
        description="This removes it from the public projects page and its city page. This can't be undone here."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            removeProject(pendingDelete);
            showToast("Project deleted");
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
