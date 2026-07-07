"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useAdminData, type Service } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/admin/PageHeader";
import AdminModal from "@/components/admin/AdminModal";
import { Field, TextInput, TextArea, FormSection } from "@/components/admin/Field";

const emptyService: Service = { slug: "", name: "", tagline: "", description: "", capabilities: [], image: "" };

export default function ServiceFormPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { services, upsertService, makeSlug } = useAdminData();
  const { showToast } = useToast();
  const isNew = params.id === "new";
  const existing = useMemo(() => (isNew ? undefined : services.find((s) => s.slug === params.id)), [isNew, services, params.id]);

  const [form, setForm] = useState<Service>(existing ?? emptyService);
  const [capInput, setCapInput] = useState("");

  if (!isNew && !existing) {
    return (
      <div>
        <PageHeader eyebrow="Content" title="Service not found" />
        <Link href="/services" className="text-sm text-safety-dim hover:text-safety inline-flex items-center gap-1.5">
          <ArrowLeft size={15} /> Back to services
        </Link>
      </div>
    );
  }

  function update<K extends keyof Service>(key: K, value: Service[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addCapability() {
    if (capInput.trim()) {
      update("capabilities", [...form.capabilities, capInput.trim()]);
      setCapInput("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = form.slug || makeSlug(form.name);
    upsertService({ ...form, slug }, isNew ? undefined : existing!.slug);
    showToast(isNew ? "Service created" : "Service updated");
    router.push("/services");
  }

  return (
    <AdminModal title={isNew ? "New service" : `Edit ${existing?.name}`} onClose={() => router.push("/services")} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
        <FormSection title="Service details">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" required>
              <TextInput required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Residential" />
            </Field>
            <Field label="URL slug" hint="Leave blank to auto-generate">
              <TextInput value={form.slug} onChange={(e) => update("slug", makeSlug(e.target.value))} placeholder="residential" />
            </Field>
          </div>
          <Field label="Tagline" required>
            <TextInput required value={form.tagline} onChange={(e) => update("tagline", e.target.value)} />
          </Field>
          <Field label="Description" required>
            <TextArea required rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
          </Field>
          <Field label="Image URL" required>
            <TextInput required type="url" value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://…" />
          </Field>
        </FormSection>

        <FormSection title="Capabilities" description="Shown as a bullet list on the service page.">
          <div className="flex flex-col gap-2">
            {form.capabilities.map((c, i) => (
              <div key={i} className="flex gap-2">
                <TextInput
                  value={c}
                  onChange={(e) => {
                    const next = [...form.capabilities];
                    next[i] = e.target.value;
                    update("capabilities", next);
                  }}
                />
                <button
                  type="button"
                  onClick={() => update("capabilities", form.capabilities.filter((_, idx) => idx !== i))}
                  className="p-2.5 text-charcoal/40 hover:text-safety-dim"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <TextInput
              value={capInput}
              onChange={(e) => setCapInput(e.target.value)}
              placeholder="e.g. High-rise towers"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCapability();
                }
              }}
            />
            <button type="button" onClick={addCapability} className="shrink-0 px-4 py-2 text-sm font-medium border border-charcoal/20 hover:bg-charcoal/[0.04] transition-colors">
              Add
            </button>
          </div>
        </FormSection>

        <div className="flex items-center gap-3">
          <button type="submit" className="inline-flex items-center gap-2 bg-charcoal text-concrete px-5 py-2.5 text-sm font-medium hover:bg-safety transition-colors">
            <Save size={16} /> {isNew ? "Create service" : "Save changes"}
          </button>
          <Link href="/services" className="px-5 py-2.5 text-sm font-medium border border-charcoal/20 hover:bg-charcoal/[0.04] transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </AdminModal>
  );
}
