"use client";

import { useState } from "react";
import { Save, ShieldCheck } from "lucide-react";
import { useAdminData } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PageHeader from "@/components/admin/PageHeader";
import { Field, TextInput, FormSection } from "@/components/admin/Field";

export default function SettingsPage() {
  const { settings, updateSettings, users, ready } = useAdminData();
  const { showToast } = useToast();
  const [form, setForm] = useState(settings);

  if (!ready) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateSettings(form);
    showToast("Settings saved");
  }

  return (
    <div>
      <PageHeader eyebrow="System" title="Settings" description="Company details shown across the public site." />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
        <FormSection title="Company">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Company name" required>
              <TextInput required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </Field>
            <Field label="Tagline" required>
              <TextInput required value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            </Field>
          </div>
          <Field label="Registered address">
            <TextInput value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
        </FormSection>

        <FormSection title="Contact">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Support email" required>
              <TextInput required type="email" value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} />
            </Field>
            <Field label="Support phone" required>
              <TextInput required value={form.supportPhone} onChange={(e) => setForm({ ...form, supportPhone: e.target.value })} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Social links">
          <Field label="Instagram">
            <TextInput type="url" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          </Field>
          <Field label="LinkedIn">
            <TextInput type="url" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
          </Field>
          <Field label="Facebook">
            <TextInput type="url" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
          </Field>
        </FormSection>

        <FormSection title="Maintenance mode" description="Show a maintenance notice on the public site instead of live pages.">
          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <span
              onClick={() => setForm({ ...form, maintenanceMode: !form.maintenanceMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.maintenanceMode ? "bg-safety" : "bg-charcoal/20"
              }`}
            >
              <span
                className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white transition-transform ${
                  form.maintenanceMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </span>
            <span className="text-sm">{form.maintenanceMode ? "Enabled" : "Disabled"}</span>
          </label>
        </FormSection>

        <div className="flex items-center gap-3">
          <button type="submit" className="inline-flex items-center gap-2 bg-charcoal text-concrete px-5 py-2.5 text-sm font-medium hover:bg-safety transition-colors">
            <Save size={16} /> Save settings
          </button>
        </div>
      </form>

      <div className="mt-10 max-w-2xl">
        <div className="mb-4">
          <h3 className="font-display text-lg">Admin users</h3>
          <p className="text-sm text-charcoal/55">Who has access to this panel. User management will move here once the backend is connected.</p>
        </div>
        <div className="bg-white border border-charcoal/12 rounded-sm divide-y divide-charcoal/8">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-4 px-5 py-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blueprint/10 text-blueprint text-xs font-mono font-medium shrink-0">
                {u.name.split(" ").map((n) => n[0]).join("")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{u.name}</div>
                <div className="text-xs text-charcoal/50">{u.email}</div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-charcoal/55">
                <ShieldCheck size={13} /> {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
