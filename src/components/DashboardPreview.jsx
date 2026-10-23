import { ArrowDownRight, ArrowUpRight, CircleDollarSign } from "lucide-react";

const metrics = [
  { label: "Income", value: "₦840,000", icon: ArrowUpRight, tone: "text-emerald-700 dark:text-emerald-300" },
  { label: "Expenses", value: "₦312,500", icon: ArrowDownRight, tone: "text-amber-700 dark:text-amber-300" },
  { label: "Savings", value: "₦186,000", icon: CircleDollarSign, tone: "text-[#4d6d32] dark:text-[#d0e7ad]" },
];

const categories = [
  { name: "Home", amount: "₦124,000", width: "68%", color: "bg-[#174b38]" },
  { name: "Food", amount: "₦78,500", width: "45%", color: "bg-[#8bb467]" },
  { name: "Transport", amount: "₦42,000", width: "30%", color: "bg-[#d5a958]" },
];

const DashboardPreview = ({ compact = false }) => (
  <div
    aria-label="Illustrative FINART dashboard preview with sample financial figures"
    role="region"
    className={`relative mx-auto w-full max-w-[690px] rounded-[1.75rem] border border-[#e1e8df] bg-white p-4 shadow-[0_24px_80px_-36px_rgba(22,65,45,0.38)] dark:border-white/10 dark:bg-[#1b2821] sm:p-6 ${compact ? "max-w-[610px]" : ""}`}
  >
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#e8f1e4] text-[#174b38] dark:bg-[#2b4033] dark:text-[#d0e7ad]">
          <CircleDollarSign aria-hidden="true" size={22} />
        </div>
        <div>
          <p className="font-semibold">Your overview</p>
          <p className="text-xs text-[#738078] dark:text-[#a8b4aa]">A sample monthly snapshot</p>
        </div>
      </div>
      <span className="rounded-full bg-[#f0f4ed] px-3 py-1.5 text-xs font-medium text-[#53665a] dark:bg-[#2b4033] dark:text-[#d8e4d9]">
        This month
      </span>
    </div>

    <div className="rounded-2xl bg-[#174b38] p-5 text-white sm:p-6">
      <p className="text-sm text-white/75">Total balance</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">₦2,480,000</p>
      <div className="mt-5 flex items-end justify-between gap-4">
        <p className="text-sm text-white/75">Illustrative demo data</p>
        <svg aria-hidden="true" viewBox="0 0 160 42" className="h-10 w-32 sm:w-40">
          <path d="M2 34 C18 31 19 21 34 25 S52 28 65 17 S83 23 96 14 S115 19 127 8 S145 12 158 3" fill="none" stroke="#d0e7ad" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </div>

    <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
      {metrics.map(({ label, value, icon: Icon, tone }) => (
        <div key={label} className="min-w-0 rounded-xl border border-[#e9eee7] bg-[#fbfcfa] p-3 dark:border-white/10 dark:bg-[#202e26] sm:p-4">
          <div className={`mb-2 flex items-center gap-1 text-xs ${tone}`}>
            <Icon aria-hidden="true" size={15} />
            <span>{label}</span>
          </div>
          <p className="truncate text-sm font-semibold sm:text-base">{value}</p>
        </div>
      ))}
    </div>

    {!compact && (
      <div className="mt-5 rounded-xl border border-[#e9eee7] p-4 dark:border-white/10 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="font-semibold">Spending breakdown</p>
          <span className="text-xs text-[#738078] dark:text-[#a8b4aa]">Sample categories</span>
        </div>
        <ul className="space-y-3">
          {categories.map(({ name, amount, width, color }) => (
            <li key={name} className="grid grid-cols-[76px_1fr_auto] items-center gap-3 text-xs sm:grid-cols-[92px_1fr_auto] sm:text-sm">
              <span>{name}</span>
              <span className="h-2 overflow-hidden rounded-full bg-[#edf1eb] dark:bg-white/10">
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
