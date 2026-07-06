"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useAdminData, type Blog } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/admin/PageHeader";
import { Field, TextInput, TextArea, FormSection } from "@/components/admin/Field";

const today = () => new Date().toISOString().slice(0, 10);

const emptyBlog: Blog = {
  slug: "",
  title: "",
  excerpt: "",
  content: [],
  coverImage: "",
  author: "Editorial Team",
  date: today(),
  category: "",
};

export default function BlogFormPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { blogs, upsertBlog, makeSlug } = useAdminData();
  const { showToast } = useToast();
  const isNew = params.id === "new";
  const existing = useMemo(() => (isNew ? undefined : blogs.find((b) => b.slug === params.id)), [isNew, blogs, params.id]);

  const [form, setForm] = useState<Blog>(existing ?? emptyBlog);
  const [contentText, setContentText] = useState((existing?.content ?? []).join("\n\n"));

  if (!isNew && !existing) {
    return (
      <div>
        <PageHeader eyebrow="Content" title="Post not found" />
        <Link href="/blogs" className="text-sm text-safety-dim hover:text-safety inline-flex items-center gap-1.5">
          <ArrowLeft size={15} /> Back to journal
        </Link>
      </div>
    );
  }

  function update<K extends keyof Blog>(key: K, value: Blog[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = form.slug || makeSlug(form.title);
    const content = contentText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    upsertBlog({ ...form, slug, content }, isNew ? undefined : existing!.slug);
    showToast(isNew ? "Post created" : "Post updated");
    router.push("/blogs");
  }

  return (
    <div>
      <Link href="/blogs" className="text-sm text-charcoal/55 hover:text-safety-dim inline-flex items-center gap-1.5 mb-4">
        <ArrowLeft size={15} /> Back to journal
      </Link>
      <PageHeader eyebrow="Content" title={isNew ? "New post" : `Edit post`} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
        <FormSection title="Post details">
          <Field label="Title" required>
            <TextInput required value={form.title} onChange={(e) => update("title", e.target.value)} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="URL slug" hint="Leave blank to auto-generate">
              <TextInput value={form.slug} onChange={(e) => update("slug", makeSlug(e.target.value))} />
            </Field>
            <Field label="Category" required>
              <TextInput required value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="Buyer Guide" />
            </Field>
            <Field label="Author">
              <TextInput value={form.author} onChange={(e) => update("author", e.target.value)} />
            </Field>
            <Field label="Publish date">
              <TextInput type="date" value={form.date} onChange={(e) => update("date", e.target.value)} />
            </Field>
          </div>
          <Field label="Cover image URL" required>
            <TextInput required type="url" value={form.coverImage} onChange={(e) => update("coverImage", e.target.value)} />
          </Field>
          <Field label="Excerpt" required hint="One or two sentences shown on the journal listing page">
            <TextArea required rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} />
          </Field>
        </FormSection>

        <FormSection title="Body" description="Separate paragraphs with a blank line.">
          <TextArea rows={10} value={contentText} onChange={(e) => setContentText(e.target.value)} />
        </FormSection>

        <div className="flex items-center gap-3">
          <button type="submit" className="inline-flex items-center gap-2 bg-charcoal text-concrete px-5 py-2.5 text-sm font-medium hover:bg-safety transition-colors">
            <Save size={16} /> {isNew ? "Publish post" : "Save changes"}
          </button>
          <Link href="/blogs" className="px-5 py-2.5 text-sm font-medium border border-charcoal/20 hover:bg-charcoal/[0.04] transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
