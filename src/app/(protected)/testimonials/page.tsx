"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Quote, Star, Save } from "lucide-react";
import { useAdminData, type Testimonial } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import AdminModal from "@/components/admin/AdminModal";
import { Field, TextInput, TextArea } from "@/components/admin/Field";

const empty: Testimonial = { name: "", role: "", message: "", rating: 5 };

export default function TestimonialsPage() {
  const { testimonials, upsertTestimonial, removeTestimonial, ready } = useAdminData();
  const { showToast } = useToast();
  const [panelIndex, setPanelIndex] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<Testimonial>(empty);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  if (!ready) return null;

  function openNew() {
    setForm(empty);
    setPanelIndex("new");
  }

  function openEdit(i: number) {
    setForm(testimonials[i]);
    setPanelIndex(i);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    upsertTestimonial(form, panelIndex === "new" ? undefined : (panelIndex as number));
    showToast(panelIndex === "new" ? "Testimonial added" : "Testimonial updated");
    setPanelIndex(null);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Testimonials"
        description="Client quotes featured on the homepage."
        action={
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-charcoal text-concrete px-4 py-2.5 text-sm font-medium hover:bg-safety transition-colors">
            <Plus size={16} /> New testimonial
          </button>
        }
      />

      {testimonials.length === 0 ? (
        <EmptyState icon={Quote} title="No testimonials yet" />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white border border-charcoal/12 rounded-sm p-5 relative">
              <div className="flex items-center gap-0.5 mb-3 text-safety">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={13} fill={s < t.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                ))}
              </div>
              <p className="text-sm text-charcoal/75 leading-relaxed mb-4">&ldquo;{t.message}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-charcoal/50">{t.role}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(i)} className="p-2 text-charcoal/45 hover:text-blueprint transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setPendingDelete(i)} className="p-2 text-charcoal/45 hover:text-safety-dim transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        open={panelIndex !== null}
        title={panelIndex === "new" ? "New testimonial" : "Edit testimonial"}
        onClose={() => setPanelIndex(null)}
        maxWidth="max-w-md"
      >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="Client name" required>
                <TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Role / project" required>
                <TextInput required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Homeowner, Skyline Towers" />
              </Field>
              <Field label="Message" required>
                <TextArea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </Field>
              <Field label="Rating">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, rating: s + 1 })}
                      className="text-safety p-1"
                    >
                      <Star size={20} fill={s < form.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                    </button>
                  ))}
                </div>
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
      </AdminModal>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this testimonial?"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete !== null) {
            removeTestimonial(pendingDelete);
            showToast("Testimonial deleted");
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
