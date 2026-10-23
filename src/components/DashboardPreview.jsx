import { ArrowDownRight, ArrowUpRight, CircleDollarSign } from "lucide-react";

const metrics = [
 { label: "Income", value: "₦840,000", icon: ArrowUpRight, tone: "text-status-success " },
 { label: "Expenses", value: "₦312,500", icon: ArrowDownRight, tone: "text-status-warning " },
 { label: "Savings", value: "₦186,000", icon: CircleDollarSign, tone: "text-primary " },
];

const categories = [
 { name: "Home", amount: "₦124,000", width: "68%", color: "bg-brand" },
 { name: "Food", amount: "₦78,500", width: "45%", color: "bg-muted" },
 { name: "Transport", amount: "₦42,000", width: "30%", color: "bg-muted" },
];

const DashboardPreview = ({ compact = false }) => (
  <div
    aria-label="Illustrative FINART dashboard preview with sample financial figures"
    role="region"
 className={`relative mx-auto w-full max-w-[690px] rounded-[1.75rem] border border-border bg-surface-overlay p-4 shadow-400 sm:p-6 ${compact ? "max-w-[610px]" : ""}`}
  >
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
 <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary ">
          <CircleDollarSign aria-hidden="true" size={22} />
        </div>
        <div>
          <p className="font-semibold">Your overview</p>
 <p className="text-xs text-muted-foreground ">A sample monthly snapshot</p>
        </div>
      </div>
 <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground ">
        This month
      </span>
    </div>

 <div className="rounded-2xl bg-brand p-5 text-brand-foreground sm:p-6">
 <p className="text-sm text-brand-foreground/75">Total balance</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">₦2,480,000</p>
      <div className="mt-5 flex items-end justify-between gap-4">
 <p className="text-sm text-brand-foreground/75">Illustrative demo data</p>
        <svg aria-hidden="true" viewBox="0 0 160 42" className="h-10 w-32 sm:w-40">
 <path d="M2 34 C18 31 19 21 34 25 S52 28 65 17 S83 23 96 14 S115 19 127 8 S145 12 158 3" fill="none" className="stroke-accent" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </div>

    <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
      {metrics.map(({ label, value, icon: Icon, tone }) => (
 <div key={label} className="min-w-0 rounded-xl border border-border bg-muted p-3 sm:p-4">
          <div className={`mb-2 flex items-center gap-1 text-xs ${tone}`}>
            <Icon aria-hidden="true" size={15} />
            <span>{label}</span>
          </div>
          <p className="truncate text-sm font-semibold sm:text-base">{value}</p>
        </div>
      ))}
    </div>

    {!compact && (
 <div className="mt-5 rounded-xl border border-border p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="font-semibold">Spending breakdown</p>
 <span className="text-xs text-muted-foreground ">Sample categories</span>
        </div>
        <ul className="space-y-3">
          {categories.map(({ name, amount, width, color }) => (
            <li key={name} className="grid grid-cols-[76px_1fr_auto] items-center gap-3 text-xs sm:grid-cols-[92px_1fr_auto] sm:text-sm">
              <span>{name}</span>
 <span className="h-2 overflow-hidden rounded-full bg-muted ">
                <span className={`block h-full rounded-full ${color}`} style={{ width }} />
              </span>
              <span className="font-medium">{amount}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default DashboardPreview;
