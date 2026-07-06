const tones: Record<string, string> = {
  neutral: "bg-charcoal/8 text-charcoal/70 border-charcoal/15",
  ok: "bg-ok/10 text-ok border-ok/30",
  warn: "bg-warn/10 text-warn border-warn/30",
  safety: "bg-safety/10 text-safety-dim border-safety/30",
  blueprint: "bg-blueprint/8 text-blueprint border-blueprint/25",
};

export default function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium uppercase tracking-wide border rounded-sm ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
