"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { useAdminData, type Project, type ProjectType, type ProjectStatus } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/admin/PageHeader";
import { Field, TextInput, TextArea, Select, FormSection } from "@/components/admin/Field";

const emptyProject = (citySlug: string): Project => ({
  slug: "",
  citySlug,
  title: "",
  type: "Residential",
  status: "ongoing",
  heroImage: "",
  description: "",
  scopeOfWork: "",
  materials: [],
  sqft: 0,
  units: undefined,
  client: "",
  year: new Date().getFullYear().toString(),
  gallery: [],
  timeline: [],
});

export default function ProjectFormPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { projects, cities, upsertProject, makeSlug } = useAdminData();
  const { showToast } = useToast();
  const isNew = params.id === "new";
  const existing = useMemo(() => (isNew ? undefined : projects.find((p) => p.slug === params.id)), [isNew, projects, params.id]);

  const [form, setForm] = useState<Project>(existing ?? emptyProject(cities[0]?.slug ?? ""));
  const [materialInput, setMaterialInput] = useState("");

  if (!isNew && !existing) {
    return (
      <div>
        <PageHeader eyebrow="Content" title="Project not found" />
        <Link href="/projects" className="text-sm text-safety-dim hover:text-safety inline-flex items-center gap-1.5">
          <ArrowLeft size={15} /> Back to projects
        </Link>
      </div>
    );
  }

  function update<K extends keyof Project>(key: K, value: Project[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = form.slug || makeSlug(form.title);
    const finalForm = { ...form, slug };
    upsertProject(finalForm, isNew ? undefined : existing!.slug);
    showToast(isNew ? "Project created" : "Project updated");
    router.push("/projects");
  }

  return (
    <div>
      <Link href="/projects" className="text-sm text-charcoal/55 hover:text-safety-dim inline-flex items-center gap-1.5 mb-4">
        <ArrowLeft size={15} /> Back to projects
      </Link>
      <PageHeader
        eyebrow="Content"
        title={isNew ? "New project" : `Edit ${existing?.title}`}
        description="Changes here update the public projects page and its city page."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
        <FormSection title="Basics">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Project title" required>
              <TextInput
                required
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Skyline Towers"
              />
            </Field>
            <Field label="URL slug" hint="Leave blank to auto-generate from the title">
              <TextInput
                value={form.slug}
                onChange={(e) => update("slug", makeSlug(e.target.value))}
                placeholder="skyline-towers"
              />
            </Field>
            <Field label="City" required>
              <Select value={form.citySlug} onChange={(e) => update("citySlug", e.target.value)} required>
                {cities.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Project type" required>
              <Select value={form.type} onChange={(e) => update("type", e.target.value as ProjectType)}>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Infrastructure">Infrastructure</option>
              </Select>
            </Field>
            <Field label="Status" required>
              <Select value={form.status} onChange={(e) => update("status", e.target.value as ProjectStatus)}>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </Select>
            </Field>
            <Field label="Year">
              <TextInput value={form.year} onChange={(e) => update("year", e.target.value)} placeholder="2026" />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Details">
          <Field label="Hero image URL" required>
            <TextInput
              required
              type="url"
              value={form.heroImage}
              onChange={(e) => update("heroImage", e.target.value)}
              placeholder="https://…"
            />
          </Field>
          <Field label="Description" required>
            <TextArea
              required
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </Field>
          <Field label="Scope of work">
            <TextArea rows={2} value={form.scopeOfWork} onChange={(e) => update("scopeOfWork", e.target.value)} />
          </Field>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Sq. ft" required>
              <TextInput
                required
                type="number"
                min={0}
                value={form.sqft}
                onChange={(e) => update("sqft", Number(e.target.value))}
              />
            </Field>
            <Field label="Units" hint="Optional, residential only">
              <TextInput
                type="number"
                min={0}
                value={form.units ?? ""}
                onChange={(e) => update("units", e.target.value ? Number(e.target.value) : undefined)}
              />
            </Field>
            <Field label="Client">
              <TextInput value={form.client} onChange={(e) => update("client", e.target.value)} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Materials" description="Key materials or systems used, shown as tags on the project page.">
          <div className="flex flex-wrap gap-2">
            {form.materials.map((m, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 bg-charcoal/[0.05] border border-charcoal/15 px-2.5 py-1 text-xs rounded-sm"
              >
                {m}
                <button
                  type="button"
                  onClick={() => update("materials", form.materials.filter((_, idx) => idx !== i))}
                  className="text-charcoal/40 hover:text-safety-dim"
                >
                  <Trash2 size={11} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <TextInput
              value={materialInput}
              onChange={(e) => setMaterialInput(e.target.value)}
              placeholder="e.g. M60 grade concrete"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (materialInput.trim()) {
                    update("materials", [...form.materials, materialInput.trim()]);
                    setMaterialInput("");
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (materialInput.trim()) {
                  update("materials", [...form.materials, materialInput.trim()]);
                  setMaterialInput("");
                }
              }}
              className="shrink-0 px-4 py-2 text-sm font-medium border border-charcoal/20 hover:bg-charcoal/[0.04] transition-colors"
            >
              Add
            </button>
          </div>
        </FormSection>

        <FormSection title="Gallery" description="Image URLs and captions shown in the project gallery.">
          <div className="flex flex-col gap-3">
            {form.gallery.map((g, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 grid sm:grid-cols-2 gap-2">
                  <TextInput
                    value={g.url}
                    placeholder="Image URL"
                    onChange={(e) => {
                      const next = [...form.gallery];
                      next[i] = { ...next[i], url: e.target.value };
                      update("gallery", next);
                    }}
                  />
                  <TextInput
                    value={g.caption}
                    placeholder="Caption"
                    onChange={(e) => {
                      const next = [...form.gallery];
                      next[i] = { ...next[i], caption: e.target.value };
                      update("gallery", next);
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => update("gallery", form.gallery.filter((_, idx) => idx !== i))}
                  className="p-2.5 text-charcoal/40 hover:text-safety-dim"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => update("gallery", [...form.gallery, { url: "", caption: "" }])}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blueprint hover:text-safety-dim w-fit"
          >
            <Plus size={15} /> Add image
          </button>
        </FormSection>

        <FormSection title="Timeline" description="Construction phases shown on the project page.">
          <div className="flex flex-col gap-3">
            {form.timeline.map((t, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 grid sm:grid-cols-3 gap-2">
                  <TextInput
                    value={t.phase}
                    placeholder="Phase name"
                    onChange={(e) => {
                      const next = [...form.timeline];
                      next[i] = { ...next[i], phase: e.target.value };
                      update("timeline", next);
                    }}
                  />
                  <TextInput
                    value={t.date}
                    placeholder="Date, e.g. Jan 2026"
                    onChange={(e) => {
                      const next = [...form.timeline];
                      next[i] = { ...next[i], date: e.target.value };
                      update("timeline", next);
                    }}
                  />
                  <TextInput
                    value={t.description}
                    placeholder="Description"
                    onChange={(e) => {
                      const next = [...form.timeline];
                      next[i] = { ...next[i], description: e.target.value };
                      update("timeline", next);
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => update("timeline", form.timeline.filter((_, idx) => idx !== i))}
                  className="p-2.5 text-charcoal/40 hover:text-safety-dim"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => update("timeline", [...form.timeline, { phase: "", date: "", description: "" }])}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blueprint hover:text-safety-dim w-fit"
          >
            <Plus size={15} /> Add phase
          </button>
        </FormSection>

        <div className="flex items-center gap-3 sticky bottom-0 bg-concrete/95 backdrop-blur py-4 border-t border-charcoal/10">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-charcoal text-concrete px-5 py-2.5 text-sm font-medium hover:bg-safety transition-colors"
          >
            <Save size={16} /> {isNew ? "Create project" : "Save changes"}
          </button>
          <Link href="/projects" className="px-5 py-2.5 text-sm font-medium border border-charcoal/20 hover:bg-charcoal/[0.04] transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
