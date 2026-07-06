"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useAdminData, type City } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/admin/PageHeader";
import { Field, TextInput, TextArea, FormSection } from "@/components/admin/Field";

const emptyCity: City = { slug: "", name: "", state: "", coverImage: "", description: "", totalSqft: 0 };

export default function CityFormPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { cities, upsertCity, makeSlug } = useAdminData();
  const { showToast } = useToast();
  const isNew = params.id === "new";
  const existing = useMemo(() => (isNew ? undefined : cities.find((c) => c.slug === params.id)), [isNew, cities, params.id]);

  const [form, setForm] = useState<City>(existing ?? emptyCity);

  if (!isNew && !existing) {
    return (
      <div>
        <PageHeader eyebrow="Content" title="City not found" />
        <Link href="/cities" className="text-sm text-safety-dim hover:text-safety inline-flex items-center gap-1.5">
          <ArrowLeft size={15} /> Back to cities
        </Link>
      </div>
    );
  }

  function update<K extends keyof City>(key: K, value: City[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = form.slug || makeSlug(form.name);
    upsertCity({ ...form, slug }, isNew ? undefined : existing!.slug);
    showToast(isNew ? "City created" : "City updated");
    router.push("/cities");
  }

  return (
    <div>
      <Link href="/cities" className="text-sm text-charcoal/55 hover:text-safety-dim inline-flex items-center gap-1.5 mb-4">
        <ArrowLeft size={15} /> Back to cities
      </Link>
      <PageHeader eyebrow="Content" title={isNew ? "New city" : `Edit ${existing?.name}`} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
        <FormSection title="City details">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="City name" required>
              <TextInput required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Mumbai" />
            </Field>
            <Field label="URL slug" hint="Leave blank to auto-generate">
              <TextInput value={form.slug} onChange={(e) => update("slug", makeSlug(e.target.value))} placeholder="mumbai" />
            </Field>
            <Field label="State" required>
              <TextInput required value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="Maharashtra" />
            </Field>
            <Field label="Total delivered sq.ft (in lakh)" required>
              <TextInput
                required
                type="number"
                min={0}
                value={form.totalSqft}
                onChange={(e) => update("totalSqft", Number(e.target.value))}
              />
            </Field>
          </div>
          <Field label="Cover image URL" required>
            <TextInput required type="url" value={form.coverImage} onChange={(e) => update("coverImage", e.target.value)} placeholder="https://…" />
          </Field>
          <Field label="Description" required>
            <TextArea required rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
          </Field>
        </FormSection>

        <div className="flex items-center gap-3">
          <button type="submit" className="inline-flex items-center gap-2 bg-charcoal text-concrete px-5 py-2.5 text-sm font-medium hover:bg-safety transition-colors">
            <Save size={16} /> {isNew ? "Create city" : "Save changes"}
          </button>
          <Link href="/cities" className="px-5 py-2.5 text-sm font-medium border border-charcoal/20 hover:bg-charcoal/[0.04] transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
