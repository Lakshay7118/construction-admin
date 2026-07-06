export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-safety-dim mb-2">
          <span className="w-6 h-px bg-current" />
          {eyebrow.toUpperCase()}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl leading-tight">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-charcoal/60 max-w-xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
