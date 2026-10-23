import { useState } from "react";
import { Check, Moon, Sun, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/layout/context/authProvider";
import { useTheme } from "@/layout/context/themeProvider";
import { updateAccountDisplayName, getAuthErrorMessage, sendCurrentUserPasswordResetEmail } from "@/services/auth";
import { StaffPageHeader, StaffPanel, StaffSecurityNotice } from "@/components/staff/StaffUI";

const StaffSettingsPage = () => {
  const { user, refreshUser } = useAuth();
  const { theme, setLight, setDark } = useTheme();
  const [name, setName] = useState(user?.displayName || "");
  const [saving, setSaving] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const saveName = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateAccountDisplayName(name);
      await refreshUser();
      toast.success("Display name updated.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const sendPasswordReset = async () => {
    setResettingPassword(true);
    try {
      await sendCurrentUserPasswordResetEmail();
      toast.success("Password reset email sent to your account address.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <>
      <StaffPageHeader title="Staff settings" description="Manage your own profile and browser appearance. Staff authorization cannot be changed here." />
      <div className="grid gap-5 xl:grid-cols-2">
        <StaffPanel title="Staff profile" description="Profile details from the signed-in Firebase Authentication account.">
          <div className="mb-5 mt-4 flex items-center gap-3 rounded-xl bg-muted/50 p-4">
            <span className="flex size-11 items-center justify-center rounded-full bg-[#e9f1e4] text-[#174b38] dark:bg-[#2a4032] dark:text-[#d0e7ad]"><UserRound aria-hidden="true" size={20} /></span>
            <div className="min-w-0"><p className="truncate font-medium">{user?.email}</p><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Check aria-hidden="true" size={13} className="text-emerald-600" /> Verified account · staff claim confirmed</p></div>
          </div>
          <form onSubmit={saveName} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="staff-display-name" className="text-sm font-medium">Display name</label>
              <input id="staff-display-name" required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4d7c42]" />
            </div>
            <button type="submit" disabled={saving || name.trim() === (user?.displayName || "")} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#174b38] px-4 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Saving…" : "Save profile"}</button>
          </form>
        </StaffPanel>
        <StaffPanel title="Preferences and security" description="Appearance is shared with the existing FINART theme setting.">
          <div className="mt-4">
            <p className="text-sm font-medium">Appearance</p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={setLight} aria-pressed={theme === "light"} className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm ${theme === "light" ? "border-[#174b38] bg-[#e9f1e4] text-[#174b38] dark:bg-[#2a4032] dark:text-[#d0e7ad]" : "border-border"}`}><Sun aria-hidden="true" size={16} /> Light</button>
              <button type="button" onClick={setDark} aria-pressed={theme === "dark"} className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm ${theme === "dark" ? "border-[#174b38] bg-[#e9f1e4] text-[#174b38] dark:bg-[#2a4032] dark:text-[#d0e7ad]" : "border-border"}`}><Moon aria-hidden="true" size={16} /> Dark</button>
            </div>
          </div>
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-sm font-medium">Account security</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Send a password-reset email to the address on your signed-in account.</p>
            <button type="button" onClick={sendPasswordReset} disabled={resettingPassword} className="mt-3 inline-flex min-h-10 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted disabled:opacity-60">{resettingPassword ? "Sending…" : "Send password reset email"}</button>
          </div>
        </StaffPanel>
        <div className="xl:col-span-2"><StaffSecurityNotice /></div>
      </div>
    </>
  );
};

export default StaffSettingsPage;
