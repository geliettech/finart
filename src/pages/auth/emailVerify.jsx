import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { Check, MailCheck, RefreshCw } from "lucide-react";
import { AuthLayout } from "@/layout/dashboard/authLayout";
import { useAuth } from "@/layout/context/authProvider";
import {
  getAuthErrorMessage,
  resendVerificationEmail,
} from "@/services/auth";
import { getSafeReturnTo } from "@/utils/authNavigation";
import { toast } from "react-toastify";

const EmailVerifyPage = () => {
  const { user, loading, refreshUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return undefined;

    const timer = window.setInterval(() => {
      setCooldown((remaining) => Math.max(0, remaining - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!loading && user?.emailVerified) {
      navigate(getSafeReturnTo(location.state), { replace: true });
    }
  }, [loading, user?.emailVerified, location.state, navigate]);

  if (loading) {
    return (
 <main className="flex min-h-screen items-center justify-center bg-background " role="status">
 <span className="size-8 animate-spin rounded-full border-2 border-border border-t-primary " />
        <span className="sr-only">Checking verification status</span>
      </main>
    );
  }

  if (!user) return <Navigate to="/sign-in" replace />;
  if (user.emailVerified) return null;

  const handleResend = async () => {
    setBusy(true);
    setErrorMessage("");
    setStatusMessage("");
    try {
      await resendVerificationEmail();
      setCooldown(60);
      setStatusMessage("Verification email sent. Check your inbox and spam folder.");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const handleCheckStatus = async () => {
    setBusy(true);
    setErrorMessage("");
    setStatusMessage("");
    try {
      const refreshedUser = await refreshUser();
      if (refreshedUser?.emailVerified) {
        toast.success("Your email is verified.");
        navigate(getSafeReturnTo(location.state), { replace: true });
      } else {
        setStatusMessage("Your email is not verified yet. Open the link in your email, then check again.");
      }
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    setBusy(true);
    setErrorMessage("");
    try {
      await logout();
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      description="One quick step before you can access your FINART account."
      imgTitle="Your account is almost ready."
      imgSubtitle="Verify the email address you used to sign up to help keep your account connected to you."
    >
 <div className="rounded-2xl border border-border bg-surface-subtle p-5 ">
 <MailCheck aria-hidden="true" size={26} className="text-primary " />
        <p className="mt-4 text-sm leading-6">
          We sent a verification link to{" "}
          <span className="break-all font-semibold">{user.email}</span>. Check your inbox and spam folder.
        </p>
      </div>

 <p className="mt-5 text-sm leading-6 text-muted-foreground ">
        If the link has expired or does not work, request a new one below. Verification is confirmed by Firebase; opening this page alone does not verify your account.
      </p>

      {statusMessage && (
 <p className="mt-4 rounded-xl bg-surface-subtle p-3 text-sm leading-6 text-primary " role="status" aria-live="polite">
          {statusMessage}
        </p>
      )}
      {errorMessage && (
 <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm leading-6 text-destructive " role="alert">
          {errorMessage}
        </p>
      )}

      <div className="mt-6 grid gap-3">
        <button
          type="button"
          onClick={handleCheckStatus}
          disabled={busy}
 className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-brand-foreground transition hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Check aria-hidden="true" size={18} />
          {busy ? "Checking…" : "I've verified my email"}
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={busy || cooldown > 0}
 className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border px-5 py-3 font-semibold transition hover:bg-surface-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60 "
        >
          <RefreshCw aria-hidden="true" size={17} />
          {busy ? "Please wait…" : cooldown > 0 ? `Resend available in ${cooldown}s` : "Resend verification email"}
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm">
        <button
          type="button"
          onClick={handleLogout}
          disabled={busy}
 className="min-h-10 rounded-sm font-medium text-muted-foreground underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60 "
        >
          Sign out
        </button>
        <Link
          to="/sign-in"
          onClick={async (event) => {
            event.preventDefault();
            await handleLogout();
          }}
 className="inline-flex min-h-10 items-center rounded-sm font-medium text-muted-foreground underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring "
        >
          Return to login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default EmailVerifyPage;
