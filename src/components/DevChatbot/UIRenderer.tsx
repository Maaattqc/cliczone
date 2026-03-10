"use client";

interface UIField {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "textarea" | "email" | "currency" | "status";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
}

interface UIAction {
  label: string;
  variant: "primary" | "secondary" | "danger";
}

export interface UISchema {
  type: "form" | "table" | "dashboard" | "text";
  title?: string;
  description?: string;
  message?: string;
  fields?: UIField[];
  actions?: UIAction[];
}

function FieldRenderer({ field }: { field: UIField }) {
  const baseClass =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary";

  switch (field.type) {
    case "select":
    case "status":
      return (
        <select className={baseClass} defaultValue={field.defaultValue || ""}>
          <option value="" disabled>
            {field.placeholder || "Sélectionner..."}
          </option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    case "textarea":
      return (
        <textarea
          className={`${baseClass} min-h-[100px] resize-y`}
          placeholder={field.placeholder}
          defaultValue={field.defaultValue}
          rows={4}
        />
      );
    case "date":
      return <input type="date" className={baseClass} defaultValue={field.defaultValue} />;
    case "number":
    case "currency":
      return (
        <input type="number" className={baseClass} placeholder={field.placeholder} defaultValue={field.defaultValue} />
      );
    case "email":
      return (
        <input type="email" className={baseClass} placeholder={field.placeholder} defaultValue={field.defaultValue} />
      );
    default:
      return (
        <input type="text" className={baseClass} placeholder={field.placeholder} defaultValue={field.defaultValue} />
      );
  }
}

function ActionButton({ action }: { action: UIAction }) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    danger: "bg-destructive text-white hover:bg-destructive/90",
  };

  return (
    <button className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${variants[action.variant]}`}>
      {action.label}
    </button>
  );
}

export function UIPreview({
  schema,
  onApprove,
  onReject,
}: {
  schema: UISchema;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-6 py-3">
          <span className="text-sm font-medium text-muted-foreground">Prévisualisation en direct</span>
          <div className="flex gap-2">
            <button
              onClick={onReject}
              className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              Rejeter
            </button>
            <button
              onClick={onApprove}
              className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Approuver
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {schema.title && <h2 className="mb-1 text-xl font-semibold">{schema.title}</h2>}
          {schema.description && <p className="mb-6 text-sm text-muted-foreground">{schema.description}</p>}

          {schema.fields && schema.fields.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {schema.fields.map((field) => (
                <div key={field.id} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                  <label className="mb-1.5 block text-sm font-medium">
                    {field.label}
                    {field.required && <span className="ml-1 text-destructive">*</span>}
                  </label>
                  <FieldRenderer field={field} />
                </div>
              ))}
            </div>
          )}

          {schema.actions && schema.actions.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {schema.actions.map((action, i) => (
                <ActionButton key={i} action={action} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
