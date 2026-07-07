"use client";

import { X } from "lucide-react";

export default function AdminModal({
  open = true,
  title,
  description,
  children,
  onClose,
  maxWidth = "max-w-3xl",
}: {
  open?: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose?: () => void;
  maxWidth?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-charcoal/55 backdrop-blur-[3px]" onClick={onClose} />
      <div className={`relative bg-concrete border border-charcoal/15 rounded-sm shadow-2xl w-full ${maxWidth} max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] overflow-hidden tick-corners`}>
        <div className="flex items-start justify-between gap-4 border-b border-charcoal/10 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-display text-xl">{title}</h2>
            {description && <p className="mt-1 text-sm text-charcoal/55">{description}</p>}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 p-1.5 text-charcoal/45 hover:text-charcoal transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto scroll-thin p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
