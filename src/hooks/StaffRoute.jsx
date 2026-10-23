import { useCallback, useEffect, useState } from "react";
import { getIdTokenResult } from "firebase/auth";
import { Link, Navigate, useLocation } from "react-router";
import { auth } from "@/services/firebase";
import { useAuth } from "@/layout/context/authProvider";
import { AuthLoading } from "@/hooks/useRoute";
import { getAuthErrorMessage } from "@/services/auth";
import { toast } from "react-toastify";

const StaffRoute = ({ children }) => {
  const { user, loading, authError, logout } = useAuth();
  const location = useLocation();
  const [claimState, setClaimState] = useState({ uid: "", status: "checking", error: "" });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    }
  };

  const verifyStaffClaim = useCallback(async () => {
    if (!user?.uid || !user.emailVerified || auth.currentUser?.uid !== user.uid) return;
    setClaimState({ uid: user.uid, status: "checking", error: "" });
    try {
      const tokenResult = await getIdTokenResult(auth.currentUser, true);
      if (auth.currentUser?.uid !== user.uid) return;
      setClaimState({
        uid: user.uid,
        status: tokenResult.claims.staff === true ? "staff" : "forbidden",
        error: "",
      });
    } catch {
      setClaimState({
        uid: user.uid,
        status: "error",
        error: "Staff authorization could not be verified. Check your connection and try again.",
      });
    }
  }, [user?.uid, user?.emailVerified]);

  useEffect(() => {
    if (user?.uid && user.emailVerified) verifyStaffClaim();
  }, [user?.uid, user?.emailVerified, verifyStaffClaim]);

  if (loading) return <AuthLoading />;
  if (authError) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">Unable to check your session</h1>
        <p className="text-sm text-muted-foreground">Refresh the page or sign in again to continue.</p>
      </main>
    );
  }
  if (!user) return <Navigate to="/sign-in" replace state={{ from: location }} />;
  if (!user.emailVerified) return <Navigate to="/email-verify" replace state={{ from: location }} />;

  if (claimState.uid !== user.uid || claimState.status === "checking") {
    return <AuthLoading />;
  }

  if (claimState.status === "error") {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">Staff access could not be verified</h1>
        <p className="text-sm text-muted-foreground" role="alert">{claimState.error}</p>
 <button type="button" onClick={verifyStaffClaim} className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          Try again
        </button>
        <button type="button" onClick={handleLogout} className="text-sm font-medium text-muted-foreground underline">
          Sign out
        </button>
      </main>
    );
  }

  if (claimState.status !== "staff") {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
 <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">403 · Forbidden</p>
        <h1 className="text-2xl font-semibold">Staff access required</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          This account is signed in, but Firebase did not confirm the trusted staff authorization claim.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
 <Link to="/dashboard" className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            Go to your dashboard
          </Link>
          <button type="button" onClick={handleLogout} className="rounded-xl border border-border px-4 py-2 text-sm font-medium">
            Sign out
          </button>
        </div>
      </main>
    );
  }

  return children;
};

export default StaffRoute;
