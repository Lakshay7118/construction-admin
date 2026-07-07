"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth, DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/auth";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/dashboard");
  }, [isLoading, isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const result = await login(email, password);
    if (result.ok) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-stretch bg-blueprint-deep">
      {/* Left: blueprint panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-blueprint blueprint-grid items-end p-12">
        <div className="absolute inset-0 bg-gradient-to-t from-blueprint-deep via-blueprint-deep/40 to-transparent" />
        <div className="relative z-10">
          <span className="flex h-12 w-12 items-center justify-center border-2 border-safety text-safety font-mono text-sm font-medium mb-8">
            KC
          </span>
          <h1 className="font-display text-4xl xl:text-5xl leading-[1.05] text-concrete max-w-md">
            Site control, not just a spreadsheet.
          </h1>
          <p className="mt-4 text-concrete/60 max-w-sm text-sm leading-relaxed">
            Manage projects, cities, and inbound enquiries for Kalpataru Constructions from one place.
          </p>
        </div>
      </div>

      {/* Right: login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-concrete">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <span className="flex h-9 w-9 items-center justify-center border-2 border-charcoal font-mono text-xs font-medium">
              KC
            </span>
            <span className="font-display text-base tracking-tight">KALPATARU ADMIN</span>
          </div>

          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-safety-dim mb-3">
            <span className="w-6 h-px bg-current" />
            ADMIN PANEL
          </div>
          <h2 className="font-display text-2xl sm:text-3xl mb-1.5">Sign in</h2>
          <p className="text-sm text-charcoal/55 mb-8">Internal access only. Use your issued credentials.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="block">
              <span className="block text-sm font-medium mb-1.5">Email</span>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={DEMO_EMAIL}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-charcoal/18 rounded-sm focus:outline-none focus:border-safety transition-colors"
                />
              </div>
            </label>

            <label className="block">
              <span className="block text-sm font-medium mb-1.5">Password</span>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-charcoal/18 rounded-sm focus:outline-none focus:border-safety transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {error && (
              <div className="text-sm text-safety-dim bg-safety/8 border border-safety/25 px-3.5 py-2.5 rounded-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex items-center justify-center gap-2 bg-charcoal text-concrete px-5 py-3 text-sm font-medium hover:bg-safety transition-colors disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign in"}
              {!submitting && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-6 p-3.5 bg-blueprint/5 border border-blueprint/15 rounded-sm">
            <p className="text-xs text-charcoal/60 font-mono leading-relaxed">
              DEMO CREDENTIALS
              <br />
              {DEMO_EMAIL} / {DEMO_PASSWORD}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
