import { useState } from "react";
import {
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  CreditCard,
  FileDown,
  Home,
  Menu,
  Moon,
  PiggyBank,
  Repeat2,
  Search,
  Settings,
  Sun,
  Wallet,
  X,
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { useAuth } from "@/layout/context/authProvider";
import { useTheme } from "@/layout/context/themeProvider";
import { DashboardDataProvider, useDashboardData } from "@/layout/dashboard/DashboardDataContext";
import {
  formatDate,
  formatMoney,
  getBudgetSpent,
  getBudgetState,
  getNextOccurrence,
} from "@/utils/dashboardCalculations";
import { getAuthErrorMessage } from "@/services/auth";
import { toast } from "react-toastify";

const navigation = [
  { label: "Overview", to: "/dashboard", icon: Home, end: true },
  { label: "Transactions", to: "/dashboard/transactions", icon: CreditCard },
  { label: "Budgets", to: "/dashboard/budgets", icon: PiggyBank },
  { label: "Recurring", to: "/dashboard/recurring", icon: Repeat2 },
  { label: "Analytics", to: "/dashboard/analytics", icon: BarChart3 },
  { label: "AI advisor", to: "/dashboard/advisor", icon: Bot },
  { label: "Reports", to: "/dashboard/reports", icon: FileDown },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

const routeTitle = {
  "/dashboard": "Overview",
  "/dashboard/transactions": "Transactions",
  "/dashboard/budgets": "Budgets",
  "/dashboard/recurring": "Recurring",
  "/dashboard/analytics": "Analytics",
  "/dashboard/advisor": "AI advisor",
  "/dashboard/reports": "Reports",
  "/dashboard/settings": "Settings",
};

const DashboardShell = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { transactions, budgets, recurring, searchTerm, setSearchTerm } = useDashboardData();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const title = routeTitle[location.pathname] || "Dashboard";
  const notifications = [
    ...(localStorage.getItem("finart-budget-notifications") === "false" ? [] : budgets.flatMap((budget) => {
      const spent = getBudgetSpent(budget, transactions);
      const state = getBudgetState(budget, spent);
      if (!state.approaching && !state.exceeded) return [];
      return [{
        id: `budget-${budget.id}`,
        title: state.exceeded ? `${budget.category} budget exceeded` : `${budget.category} budget is nearly used`,
        detail: `${formatMoney(spent, budget.currency)} spent of ${formatMoney(budget.amount, budget.currency)}.`,
      }];
    })),
    ...(localStorage.getItem("finart-recurring-notifications") === "false" ? [] : recurring
      .filter((item) => item.status === "active")
      .map((item) => ({ ...item, occurrence: getNextOccurrence(item.nextDate, item.frequency, new Date(), item.endDate) }))
      .filter((item) => item.occurrence && item.occurrence.getTime() - Date.now() <= 7 * 86400000)
      .map((item) => ({
        id: `recurring-${item.id}`,
        title: `Upcoming ${item.transactionType}: ${item.description}`,
        detail: `${formatMoney(item.amount, item.currency)} · ${formatDate(item.occurrence)}`,
      }))),
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
      setLoggingOut(false);
    }
  };

  const SidebarContent = ({ onNavigate = () => {} }) => (
    <>
      <Link
        to="/dashboard"
        onClick={onNavigate}
        className="flex h-[72px] items-center gap-3 border-b border-sidebar-border px-5 font-semibold tracking-tight"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-[#174b38] text-[#d0e7ad]">
          <Wallet aria-hidden="true" size={20} />
        </span>
        FINART
      </Link>
      <nav aria-label="Dashboard navigation" className="flex-1 space-y-1 px-3 py-5">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Workspace</p>
        {navigation.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4d7c42] ${
                isActive
                  ? "bg-[#e9f1e4] text-[#174b38] dark:bg-[#2a4032] dark:text-[#d0e7ad]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <Icon aria-hidden="true" size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4d7c42] disabled:opacity-60"
        >
          <X aria-hidden="true" size={18} />
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f5f7f3] text-foreground dark:bg-[#111a16]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-card lg:flex">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[min(18rem,85vw)] flex-col bg-card shadow-xl">
            <div className="absolute right-3 top-4 z-10">
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-xl hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4d7c42]"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
              >
                <X aria-hidden="true" size={19} />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex min-h-[72px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open dashboard navigation"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4d7c42] lg:hidden"
              >
                <Menu aria-hidden="true" size={19} />
              </button>
              <div className="min-w-0">
                <p className="hidden text-xs text-muted-foreground sm:block">
                  Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
                </p>
                <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <label className="relative hidden w-56 md:block xl:w-72">
                <Search aria-hidden="true" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search transactions"
                  aria-label="Search transactions"
                  className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex size-10 items-center justify-center rounded-xl border border-border hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4d7c42]"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              >
                {theme === "dark" ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((open) => !open)}
                  aria-expanded={notificationsOpen}
                  aria-label={`Notifications, ${notifications.length} items`}
                  className="relative flex size-10 items-center justify-center rounded-xl border border-border hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4d7c42]"
                >
                  <Bell aria-hidden="true" size={18} />
                  {notifications.length > 0 && <span aria-hidden="true" className="absolute right-2 top-2 size-2 rounded-full bg-amber-500" />}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-12 z-40 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold">Notifications</h2>
                      <button type="button" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications" className="rounded-md p-1 hover:bg-muted"><X size={16} aria-hidden="true" /></button>
                    </div>
                    <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="py-5 text-center text-sm text-muted-foreground">No budget warnings or upcoming recurring items.</p>
                      ) : notifications.map((item) => (
                        <article key={item.id} className="rounded-xl bg-muted/60 p-3">
                          <h3 className="text-sm font-medium">{item.title}</h3>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-expanded={profileOpen}
                  aria-label="Open user menu"
                  className="flex min-h-10 items-center gap-2 rounded-xl border border-border px-2 hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4d7c42] sm:px-3"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#e9f1e4] text-xs font-semibold text-[#174b38] dark:bg-[#2a4032] dark:text-[#d0e7ad]">
                    {(user?.name || user?.email || "F").charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-28 truncate text-sm font-medium xl:block">{user?.name || user?.email}</span>
                  <ChevronDown aria-hidden="true" size={15} className="hidden sm:block" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-12 z-40 w-56 rounded-2xl border border-border bg-card p-2 shadow-xl">
                    <p className="truncate px-3 py-2 text-xs text-muted-foreground">{user?.email}</p>
                    <Link to="/dashboard/settings" onClick={() => setProfileOpen(false)} className="flex min-h-10 items-center rounded-lg px-3 text-sm hover:bg-muted">Account settings</Link>
                    <button type="button" onClick={handleLogout} disabled={loggingOut} className="flex min-h-10 w-full items-center rounded-lg px-3 text-left text-sm hover:bg-muted disabled:opacity-60">{loggingOut ? "Signing out…" : "Sign out"}</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <label className="relative block px-4 pb-3 md:hidden">
            <Search aria-hidden="true" size={17} className="absolute left-7 top-1/2 -translate-y-[calc(50%+6px)] text-muted-foreground" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search transactions"
              aria-label="Search transactions"
              className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
        </header>

        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const DashboardLayout = () => (
  <DashboardDataProvider>
    <DashboardShell />
  </DashboardDataProvider>
);

export default DashboardLayout;
