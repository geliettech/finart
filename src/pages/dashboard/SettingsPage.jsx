import { useState } from "react";
import { Link } from "react-router";
import { Check, Moon, Sun, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/layout/context/authProvider";
import { useTheme } from "@/layout/context/themeProvider";
import {
  dashboardInputClass,
  ErrorNotice,
  FormField,
  PageHeader,
  Panel,
  primaryButtonClass,
} from "@/components/dashboard/DashboardUI";
import { updateAccountDisplayName, getAuthErrorMessage } from "@/services/auth";
import { SUPPORTED_CURRENCIES } from "@/utils/dashboardCalculations";

const SettingsPage = () => {
  const { user, refreshUser } = useAuth();
  const { theme, setLight, setDark } = useTheme();
  const [name, setName] = useState(user?.name || "");
  const [currency, setCurrency] = useState(localStorage.getItem("finart-currency") || "NGN");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [budgetNotifications, setBudgetNotifications] = useState(localStorage.getItem("finart-budget-notifications") !== "false");
  const [recurringNotifications, setRecurringNotifications] = useState(localStorage.getItem("finart-recurring-notifications") !== "false");

  const saveProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setProfileError("");
    try {
      await updateAccountDisplayName(name);
      await refreshUser();
      toast.success("Profile name updated.");
    } catch (error) {
      setProfileError(getAuthErrorMessage(error));
    } finally {
      setSavingProfile(false);
    }
  };

  const savePreferences = (event) => {
    event.preventDefault();
    localStorage.setItem("finart-currency", currency);
    localStorage.setItem("finart-budget-notifications", String(budgetNotifications));
    localStorage.setItem("finart-recurring-notifications", String(recurringNotifications));
    toast.success("Preferences saved on this device.");
  };

  return (
    <>
      <PageHeader eyebrow="Your account" title="Settings" description="Manage profile details and this browser's dashboard preferences." />
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Profile" description="Update your Firebase Authentication display name.">
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-muted/50 p-4">
 <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary "><UserRound aria-hidden="true" size={20} /></span>
 <div className="min-w-0"><p className="truncate font-medium">{user?.email}</p><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Check aria-hidden="true" size={13} className="text-status-success" /> Verified account</p></div>
          </div>
          <form onSubmit={saveProfile} className="space-y-4">
            <FormField label="Display name" id="profile-name">
              <input id="profile-name" required minLength={2} maxLength={100} className={dashboardInputClass} value={name} onChange={(event) => setName(event.target.value)} />
            </FormField>
            {profileError && <ErrorNotice message={profileError} />}
            <button type="submit" disabled={savingProfile || name.trim() === user?.name} className={primaryButtonClass}>{savingProfile ? "Saving…" : "Save profile"}</button>
          </form>
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-sm font-medium">Profile photo</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Avatar upload is unavailable because Firebase Storage is not configured for this project.</p>
          </div>
        </Panel>

        <Panel title="Preferences" description="Currency and notification choices are saved in this browser only.">
          <form onSubmit={savePreferences} className="space-y-5">
            <FormField label="Display currency" id="settings-currency" hint="This setting formats activity and totals; it does not convert currencies.">
              <select id="settings-currency" className={dashboardInputClass} value={currency} onChange={(event) => setCurrency(event.target.value)}>
                {SUPPORTED_CURRENCIES.map((item) => <option key={item}>{item}</option>)}
              </select>
            </FormField>
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Dashboard alerts</legend>
 <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={budgetNotifications} onChange={(event) => setBudgetNotifications(event.target.checked)} className="mt-0.5 size-4 accent-primary" /><span><span className="font-medium">Budget warnings</span><span className="mt-0.5 block text-xs text-muted-foreground">Derived from actual budget and expense data.</span></span></label>
 <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={recurringNotifications} onChange={(event) => setRecurringNotifications(event.target.checked)} className="mt-0.5 size-4 accent-primary" /><span><span className="font-medium">Upcoming recurring schedules</span><span className="mt-0.5 block text-xs text-muted-foreground">Schedule previews only; no transaction is automatically created.</span></span></label>
            </fieldset>
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm font-medium">Appearance</p>
              <div className="mt-3 flex gap-2">
 <button type="button" onClick={setLight} aria-pressed={theme === "light"} className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm ${theme === "light" ? "border-primary bg-secondary text-primary " : "border-border"}`}><Sun aria-hidden="true" size={16} /> Light</button>
 <button type="button" onClick={setDark} aria-pressed={theme === "dark"} className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm ${theme === "dark" ? "border-primary bg-secondary text-primary " : "border-border"}`}><Moon aria-hidden="true" size={16} /> Dark</button>
              </div>
            </div>
            <button type="submit" className={primaryButtonClass}>Save preferences</button>
          </form>
        </Panel>

        <Panel title="Security" description="Password changes use Firebase's password-reset flow.">
          <p className="text-sm leading-6 text-muted-foreground">For account recovery, request a reset email sent to your verified address. Firebase handles the reset link.</p>
 <Link to="/forgot-password" state={{ email: user?.email }} className="mt-4 inline-flex min-h-10 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">Request password reset</Link>
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-sm font-medium">Sessions and account deletion</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Server-side session revocation and complete account/data deletion are not configured. No controls are shown that would imply those actions were completed.</p>
          </div>
        </Panel>
      </div>
    </>
  );
};

export default SettingsPage;
