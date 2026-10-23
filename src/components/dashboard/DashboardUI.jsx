import { AlertTriangle, Inbox, LoaderCircle } from "lucide-react";

export const PageHeader = ({ eyebrow, title, description, action }) => (
  <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow && (
 <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary ">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
    {action}
  </div>
);

export const Panel = ({ title, description, action, children, className = "" }) => (
  <section className={`rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 ${className}`}>
    {(title || action) && (
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          {title && <h2 className="font-semibold tracking-tight">{title}</h2>}
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);

export const MetricCard = ({ label, value, detail, icon: Icon }) => (
  <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {Icon && (
 <span className="flex size-9 items-center justify-center rounded-xl bg-surface-subtle text-primary ">
          <Icon aria-hidden="true" size={18} />
        </span>
      )}
    </div>
    <p className="mt-4 break-words text-2xl font-semibold tracking-tight">{value}</p>
    {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
  </article>
);

export const LoadingState = ({ label = "Loading your financial data" }) => (
  <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-muted-foreground" role="status">
    <LoaderCircle aria-hidden="true" className="animate-spin" size={18} />
    {label}
  </div>
);

export const EmptyState = ({ title, description, action }) => (
  <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-border px-5 py-8 text-center">
    <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <Inbox aria-hidden="true" size={20} />
    </span>
    <h3 className="mt-3 font-semibold">{title}</h3>
    {description && <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const ErrorNotice = ({ message }) => (
  <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm" role="alert">
    <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-destructive" size={18} />
    <p>{message}</p>
  </div>
);

export const FormField = ({ label, id, error, hint, children }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-sm font-medium">{label}</label>
    {children}
    {hint && <p className="text-xs leading-5 text-muted-foreground">{hint}</p>}
    {error && <p id={`${id}-error`} className="text-sm text-destructive" role="alert">{error}</p>}
  </div>
);

export const dashboardInputClass =
  "min-h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

export const primaryButtonClass =
 "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButtonClass =
 "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium transition hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60";
