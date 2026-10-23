export const staffCapabilities = {
  users: {
    title: "User management",
    description: "Review and manage customer accounts using approved staff operations.",
    endpoint: "GET /api/staff/users (search, filters, and cursor pagination)",
    detail: "The current app has Firebase customer authentication and user-owned financial records, but no staff directory endpoint, account status model, or authorized account-management workflow.",
  },
  subscriptions: {
    title: "Subscription management",
    description: "Review plan assignments and payment status from trusted billing records.",
    endpoint: "GET /api/staff/subscriptions and GET /api/staff/payments",
    detail: "Plan names and prices are shown on the public pricing page only. There is no subscription persistence, Paystack checkout integration, payment record service, or staff billing endpoint in this repository.",
  },
  analytics: {
    title: "Platform analytics",
    description: "Review aggregated registration, plan, support, and service trends.",
    endpoint: "GET /api/staff/analytics?from=&to=",
    detail: "The current Firebase client is authorized only for per-user financial collections. No trusted aggregate endpoint or platform telemetry exists; customer financial data is not queried for staff analytics.",
  },
  support: {
    title: "Support & requests",
    description: "Triage customer requests and contact submissions through the approved support workflow.",
    endpoint: "GET /api/staff/support and PATCH /api/staff/support/{requestId}",
    detail: "No support-ticket or contact-request model, inbox endpoint, assignment flow, or status-update service is configured.",
  },
  reports: {
    title: "Reports",
    description: "Export authorized, data-minimized operational reports.",
    endpoint: "GET /api/staff/reports with server-enforced staff authorization",
    detail: "No staff reporting endpoint or platform-level report data source exists. Customer transaction exports are intentionally not reused for staff reporting.",
  },
  auditLogs: {
    title: "Audit logs",
    description: "Read a trusted record of consequential administrative actions.",
    endpoint: "GET /api/staff/audit-logs (read-only, cursor-paginated)",
    detail: "There is no trusted audit-event writer or audit-log endpoint. Client-generated events would not be a reliable security audit trail.",
  },
  systemHealth: {
    title: "System health",
    description: "Review safe operational checks provided by trusted monitoring services.",
    endpoint: "GET /api/staff/health",
    detail: "No server health-check or monitoring integration exists. Browser Firebase initialization alone cannot verify database availability or operational health.",
  },
};
