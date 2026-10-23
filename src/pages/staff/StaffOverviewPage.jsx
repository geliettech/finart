import { Link } from "react-router";
import { ArrowRight, Activity, ClipboardList, Headset, Users, WalletCards } from "lucide-react";
import { CapabilityUnavailable, StaffInfoNote, StaffPageHeader, StaffPanel, StaffSecurityNotice } from "@/components/staff/StaffUI";

const readiness = [
  { title: "User directory", description: "Registration totals and account state", endpoint: "GET /api/staff/overview and GET /api/staff/users", icon: Users, to: "/staff/users" },
  { title: "Subscriptions & payments", description: "Plan distribution and trusted billing events", endpoint: "GET /api/staff/subscriptions and GET /api/staff/payments", icon: WalletCards, to: "/staff/subscriptions" },
  { title: "Support inbox", description: "Open requests and response status", endpoint: "GET /api/staff/support", icon: Headset, to: "/staff/support" },
  { title: "Audit & health", description: "Administrative history and operational status", endpoint: "GET /api/staff/audit-logs and GET /api/staff/health", icon: Activity, to: "/staff/audit-logs" },
];

const StaffOverviewPage = () => (
  <>
    <StaffPageHeader
      eyebrow="Operations overview"
      title="Staff workspace"
      description="A secure starting point for FINART operations. Platform metrics are intentionally omitted until trusted staff data services are available."
    />
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <StaffPanel title="Operational data readiness" description="No customer or payment data is displayed without an authorized backend source.">
        <div className="mt-5 space-y-3">
          {readiness.map(({ title, description, endpoint, icon: Icon, to }) => (
            <Link key={title} to={to} className="flex items-start gap-3 rounded-xl border border-border p-4 transition hover:bg-muted/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4d7c42]">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#edf3e9] text-[#315b3c] dark:bg-[#2a3e30] dark:text-[#cde4ad]"><Icon aria-hidden="true" size={18} /></span>
              <span className="min-w-0 flex-1"><span className="block font-medium">{title}</span><span className="mt-1 block text-sm text-muted-foreground">{description}</span><span className="mt-2 block break-words font-mono text-xs text-muted-foreground">Required: {endpoint}</span></span>
              <ArrowRight aria-hidden="true" size={17} className="mt-1 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          New registrations, active users, payment totals, support volume, and recent staff actions have no reliable source in the current frontend. No estimates or sample figures are shown.
        </p>
      </StaffPanel>
      <div className="space-y-5">
        <StaffSecurityNotice />
        <StaffPanel title="Administrative activity" description="Read-only activity summary">
          <CapabilityUnavailable
            title="Recent staff activity"
            endpoint="GET /api/staff/audit-logs?limit=10"
            description="There is no server-authored audit trail to summarize. Administrative activity must be written by the trusted backend, not this client."
          />
        </StaffPanel>
        <StaffPanel title="Quick access">
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <Link to="/staff/reports" className="flex min-h-11 items-center gap-2 rounded-xl border border-border px-3 text-sm font-medium hover:bg-muted"><ClipboardList aria-hidden="true" size={17} /> Reports</Link>
            <Link to="/staff/system-health" className="flex min-h-11 items-center gap-2 rounded-xl border border-border px-3 text-sm font-medium hover:bg-muted"><Activity aria-hidden="true" size={17} /> System health</Link>
          </div>
        </StaffPanel>
        <StaffInfoNote>
          Enable the staff pages only after server endpoints verify Firebase ID tokens, enforce staff authorization on every request, apply least-privilege access, and paginate or aggregate large datasets.
        </StaffInfoNote>
      </div>
    </div>
  </>
);

export default StaffOverviewPage;
