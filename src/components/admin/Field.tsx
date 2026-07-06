export function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">
        {label}
        {required && <span className="text-safety-dim ml-0.5">*</span>}
      </span>
      {children}
      {hint && <span className="block mt-1 text-xs text-charcoal/50">{hint}</span>}
    </label>
  );
}

const inputBase =
  "w-full px-3.5 py-2.5 text-sm bg-white border border-charcoal/18 rounded-sm focus:outline-none focus:border-safety transition-colors";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputBase} resize-y ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${inputBase} ${props.className ?? ""}`}>
      {props.children}
    </select>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-charcoal/12 bg-white/60 rounded-sm p-5 sm:p-6">
      <div className="mb-5">
        <h3 className="font-display text-base">{title}</h3>
        {description && <p className="text-xs text-charcoal/55 mt-0.5">{description}</p>}
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}
