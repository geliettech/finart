import { AlertTriangle, CircleHelp, ShieldCheck } from "lucide-react";

export const StaffPageHeader = ({ eyebrow = "FINART operations", title, description, action }) => (
  <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
 <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary ">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
    {action}
  </div>
);

export const StaffPanel = ({ title, description, children, className = "" }) => (
  <section className={`rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 ${className}`}>
    {title && <h3 className="font-semibold tracking-tight">{title}</h3>}
    {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    {children}
  </section>
);

export const CapabilityUnavailable = ({ title, endpoint, description }) => (
 <div className="mt-5 rounded-xl border border-status-warning/30 bg-status-warning-surface p-4 sm:p-5" role="status">
    <div className="flex items-start gap-3">
 <AlertTriangle aria-hidden="true" size={19} className="mt-0.5 shrink-0 text-status-warning " />
      <div className="min-w-0">
        <h4 className="text-sm font-semibold">{title} is not connected</h4>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        <p className="mt-3 break-words rounded-lg bg-background/70 px-3 py-2 font-mono text-xs text-muted-foreground">
          Required backend capability: {endpoint}
        </p>
      </div>
    </div>
  </div>
);

export const StaffSecurityNotice = () => (
  <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 text-sm">
 <ShieldCheck aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-primary " />
    <p className="leading-6 text-muted-foreground">
      Staff access is verified from a refreshed, signed Firebase custom claim. Administrative data and changes remain unavailable until a trusted backend enforces authorization for those operations.
    </p>
  </div>
);

export const StaffInfoNote = ({ children }) => (
  <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm">
    <CircleHelp aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-muted-foreground" />
    <p className="leading-6 text-muted-foreground">{children}</p>
  </div>
);
