import { useState } from "react";
import {
  Activity,
  BarChart3,
  ChevronDown,
  ClipboardList,
  FileText,
  Headset,
  LayoutDashboard,
  Menu,
  Moon,
  Shield,
  Sun,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "@/layout/context/authProvider";
import { useTheme } from "@/layout/context/themeProvider";
import { getAuthErrorMessage } from "@/services/auth";

const navigation = [
  { label: "Overview", to: "/staff", icon: LayoutDashboard, end: true },
  { label: "User management", to: "/staff/users", icon: Users },
  { label: "Subscriptions", to: "/staff/subscriptions", icon: WalletCards },
  { label: "Platform analytics", to: "/staff/analytics", icon: BarChart3 },
  { label: "Support & requests", to: "/staff/support", icon: Headset },
  { label: "Reports", to: "/staff/reports", icon: FileText },
  { label: "Audit logs", to: "/staff/audit-logs", icon: ClipboardList },
  { label: "System health", to: "/staff/system-health", icon: Activity },
  { label: "Staff settings", to: "/staff/settings", icon: Shield },
];

const titleForPath = (pathname) =>
  navigation.find((item) => item.to === pathname)?.label || "Staff workspace";

const StaffLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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
      <Link to="/staff" onClick={onNavigate} className="flex h-[72px] items-center gap-3 border-b border-sidebar-border px-5 font-semibold tracking-tight">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#174b38] text-[#d0e7ad]"><Shield aria-hidden="true" size={19} /></span>
        <span className={collapsed ? "lg:hidden" : ""}>FINART <span className="font-normal text-muted-foreground">Staff</span></span>
      </Link>
      <nav aria-label="Staff navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <p className={`px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground ${collapsed ? "lg:sr-only" : ""}`}>Workspace</p>
        {navigation.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            aria-label={label}
            onClick={onNavigate}
            className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4d7c42] ${isActive ? "bg-[#e9f1e4] text-[#174b38] dark:bg-[#2a4032] dark:text-[#d0e7ad]" : "text-muted-foreground hover:bg-muted hover:text-foreground"} ${collapsed ? "lg:justify-center lg:px-2" : ""}`}
          >
            <Icon aria-hidden="true" size={18} className="shrink-0" />
            <span className={collapsed ? "lg:hidden" : ""}>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <button type="button" onClick={handleLogout} disabled={loggingOut} className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4d7c42] disabled:opacity-60 ${collapsed ? "lg:justify-center lg:px-2" : ""}`}>
          <X aria-hidden="true" size={18} className="shrink-0" />
          <span className={collapsed ? "lg:hidden" : ""}>{loggingOut ? "Signing out…" : "Sign out"}</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f5f7f3] text-foreground dark:bg-[#111a16]">
      <aside className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-sidebar-border bg-card transition-[width] lg:flex ${collapsed ? "w-[76px]" : "w-64"}`}>
        <SidebarContent />
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/45" aria-label="Close staff navigation" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-[min(19rem,86vw)] flex-col bg-card shadow-xl">
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation" className="absolute right-3 top-4 z-10 flex size-10 items-center justify-center rounded-xl hover:bg-muted"><X aria-hidden="true" size={19} /></button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
      <div className={`min-h-screen transition-[padding] ${collapsed ? "lg:pl-[76px]" : "lg:pl-64"}`}>
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex min-h-[72px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open staff navigation" className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4d7c42] lg:hidden"><Menu aria-hidden="true" size={19} /></button>
              <button type="button" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand staff navigation" : "Collapse staff navigation"} aria-expanded={!collapsed} className="hidden size-10 shrink-0 items-center justify-center rounded-xl border border-border hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4d7c42] lg:flex"><Menu aria-hidden="true" size={19} /></button>
              <div className="min-w-0">
                <p className="hidden text-xs text-muted-foreground sm:block">Staff workspace <span aria-hidden="true">/</span> {titleForPath(location.pathname)}</p>
                <h1 className="truncate text-lg font-semibold sm:text-xl">{titleForPath(location.pathname)}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden max-w-48 truncate text-right text-sm text-muted-foreground md:block">{user?.email}</span>
              <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} className="flex size-10 items-center justify-center rounded-xl border border-border hover:bg-muted">
                {theme === "dark" ? <Sun aria-hidden="true" size={17} /> : <Moon aria-hidden="true" size={17} />}
              </button>
              <div className="relative">
                <button type="button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-label="Open staff profile menu" className="flex min-h-10 items-center gap-2 rounded-xl border border-border px-2 hover:bg-muted sm:px-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#e9f1e4] text-xs font-semibold text-[#174b38] dark:bg-[#2a4032] dark:text-[#d0e7ad]">{(user?.displayName || user?.email || "S").charAt(0).toUpperCase()}</span>
                  <span className="hidden max-w-28 truncate text-sm font-medium xl:block">{user?.displayName || "Staff"}</span>
                  <ChevronDown aria-hidden="true" size={15} className="hidden sm:block" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-12 z-40 w-60 rounded-2xl border border-border bg-card p-2 shadow-xl">
                    <p className="truncate px-3 py-2 text-xs text-muted-foreground">{user?.email}</p>
                    <p className="px-3 pb-2 text-xs font-medium text-[#315b3c] dark:text-[#cde4ad]">Authorized staff</p>
                    <Link to="/staff/settings" onClick={() => setProfileOpen(false)} className="flex min-h-10 items-center rounded-lg px-3 text-sm hover:bg-muted">Staff settings</Link>
                    <button type="button" onClick={handleLogout} disabled={loggingOut} className="flex min-h-10 w-full items-center rounded-lg px-3 text-left text-sm hover:bg-muted disabled:opacity-60">{loggingOut ? "Signing out…" : "Sign out"}</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
