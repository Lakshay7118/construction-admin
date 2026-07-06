"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Award as AwardIcon, X, Save } from "lucide-react";
import { useAdminData, type Award } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Field, TextInput } from "@/components/admin/Field";

const empty: Award = { year: new Date().getFullYear().toString(), title: "", issuer: "" };

export default function AwardsPage() {
  const { awards, upsertAward, removeAward, ready } = useAdminData();
  const { showToast } = useToast();
  const [panelIndex, setPanelIndex] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<Award>(empty);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  if (!ready) return null;

  function openNew() {
    setForm(empty);
    setPanelIndex("new");
  }

  function openEdit(i: number) {
    setForm(awards[i]);
    setPanelIndex(i);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    upsertAward(form, panelIndex === "new" ? undefined : (panelIndex as number));
    showToast(panelIndex === "new" ? "Award added" : "Award updated");
    setPanelIndex(null);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Awards & recognition"
        description="Shown on the About page timeline."
        action={
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-charcoal text-concrete px-4 py-2.5 text-sm font-medium hover:bg-safety transition-colors">
            <Plus size={16} /> New award
          </button>
        }
      />

      {awards.length === 0 ? (
        <EmptyState icon={AwardIcon} title="No awards yet" />
      ) : (
        <div className="bg-white border border-charcoal/12 rounded-sm divide-y divide-charcoal/8">
          {awards.map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <span className="font-mono text-sm text-safety-dim shrink-0 w-14">{a.year}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{a.title}</div>
                <div className="text-xs text-charcoal/50">{a.issuer}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(i)} className="p-2 text-charcoal/45 hover:text-blueprint transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => setPendingDelete(i)} className="p-2 text-charcoal/45 hover:text-safety-dim transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {panelIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal/50" onClick={() => setPanelIndex(null)} />
          <div className="relative bg-concrete w-full max-w-md rounded-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg">{panelIndex === "new" ? "New award" : "Edit award"}</h3>
              <button onClick={() => setPanelIndex(null)} className="p-1 text-charcoal/50 hover:text-charcoal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="Year" required>
                <TextInput required value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
              </Field>
              <Field label="Award title" required>
                <TextInput required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>
              <Field label="Issuer" required>
                <TextInput required value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} />
              </Field>
              <div className="flex gap-3 mt-2">
                <button type="submit" className="inline-flex items-center gap-2 bg-charcoal text-concrete px-5 py-2.5 text-sm font-medium hover:bg-safety transition-colors">
                  <Save size={16} /> Save
                </button>
                <button type="button" onClick={() => setPanelIndex(null)} className="px-5 py-2.5 text-sm font-medium border border-charcoal/20 hover:bg-charcoal/[0.04] transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this award?"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete !== null) {
            removeAward(pendingDelete);
            showToast("Award deleted");
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
