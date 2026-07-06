"use client";

import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative bg-concrete border border-charcoal/15 rounded-sm shadow-xl max-w-sm w-full p-6 tick-corners">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-safety/10 text-safety-dim mb-4">
          <AlertTriangle size={20} />
        </div>
        <h3 className="font-display text-lg mb-2">{title}</h3>
        {description && <p className="text-sm text-charcoal/60 mb-6">{description}</p>}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium border border-charcoal/20 hover:bg-charcoal/[0.04] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium bg-safety-dim text-concrete hover:bg-safety transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
