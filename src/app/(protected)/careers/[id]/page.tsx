"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Plus } from "lucide-react";
import { useAdminData, type CareerPost } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/admin/PageHeader";
import { Field, TextInput, TextArea, Select, FormSection } from "@/components/admin/Field";

const emptyCareer: CareerPost = { slug: "", title: "", location: "", type: "Full-time", description: "", responsibilities: [] };

export default function CareerFormPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { careers, upsertCareer, makeSlug } = useAdminData();
  const { showToast } = useToast();
  const isNew = params.id === "new";
  const existing = useMemo(() => (isNew ? undefined : careers.find((c) => c.slug === params.id)), [isNew, careers, params.id]);

  const [form, setForm] = useState<CareerPost>(existing ?? emptyCareer);

  if (!isNew && !existing) {
    return (
      <div>
        <PageHeader eyebrow="Content" title="Role not found" />
        <Link href="/careers" className="text-sm text-safety-dim hover:text-safety inline-flex items-center gap-1.5">
          <ArrowLeft size={15} /> Back to careers
        </Link>
      </div>
    );
  }

  function update<K extends keyof CareerPost>(key: K, value: CareerPost[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = form.slug || makeSlug(`${form.title}-${form.location}`);
    upsertCareer({ ...form, slug }, isNew ? undefined : existing!.slug);
    showToast(isNew ? "Role posted" : "Role updated");
    router.push("/careers");
  }

  return (
    <div>
      <Link href="/careers" className="text-sm text-charcoal/55 hover:text-safety-dim inline-flex items-center gap-1.5 mb-4">
        <ArrowLeft size={15} /> Back to careers
      </Link>
      <PageHeader eyebrow="Content" title={isNew ? "New role" : `Edit ${existing?.title}`} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
        <FormSection title="Role details">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Job title" required>
              <TextInput required value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Senior Site Engineer" />
            </Field>
            <Field label="Location" required>
              <TextInput required value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Mumbai" />
            </Field>
            <Field label="Employment type" required>
              <Select value={form.type} onChange={(e) => update("type", e.target.value)}>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </Select>
            </Field>
            <Field label="URL slug" hint="Leave blank to auto-generate">
              <TextInput value={form.slug} onChange={(e) => update("slug", makeSlug(e.target.value))} />
            </Field>
          </div>
          <Field label="Description" required>
            <TextArea required rows={2} value={form.description} onChange={(e) => update("description", e.target.value)} />
          </Field>
        </FormSection>

        <FormSection title="Responsibilities">
          <div className="flex flex-col gap-2">
            {form.responsibilities.map((r, i) => (
              <div key={i} className="flex gap-2">
                <TextInput
                  value={r}
                  onChange={(e) => {
                    const next = [...form.responsibilities];
                    next[i] = e.target.value;
                    update("responsibilities", next);
                  }}
                />
                <button
                  type="button"
                  onClick={() => update("responsibilities", form.responsibilities.filter((_, idx) => idx !== i))}
                  className="p-2.5 text-charcoal/40 hover:text-safety-dim"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => update("responsibilities", [...form.responsibilities, ""])}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blueprint hover:text-safety-dim w-fit"
          >
            <Plus size={15} /> Add responsibility
          </button>
        </FormSection>

        <div className="flex items-center gap-3">
          <button type="submit" className="inline-flex items-center gap-2 bg-charcoal text-concrete px-5 py-2.5 text-sm font-medium hover:bg-safety transition-colors">
            <Save size={16} /> {isNew ? "Post role" : "Save changes"}
          </button>
          <Link href="/careers" className="px-5 py-2.5 text-sm font-medium border border-charcoal/20 hover:bg-charcoal/[0.04] transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
