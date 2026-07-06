import { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-charcoal/20 rounded-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal/[0.05] text-charcoal/40 mb-4">
        <Icon size={22} />
      </div>
      <h3 className="font-display text-lg mb-1">{title}</h3>
      {description && <p className="text-sm text-charcoal/55 max-w-sm mb-5">{description}</p>}
      {action}
    </div>
  );
}
