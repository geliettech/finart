import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/layout/context/authProvider";

export const AuthLoading = () => (
  <main
    className="flex min-h-screen items-center justify-center bg-[#f7f8f4] px-6 text-[#18352a] dark:bg-[#111a16] dark:text-white"
    role="status"
    aria-live="polite"
  >
    <span className="size-8 animate-spin rounded-full border-2 border-[#d9e4d5] border-t-[#174b38] dark:border-white/20 dark:border-t-[#d0e7ad]" />
    <span className="sr-only">Checking your sign-in status</span>
  </main>
);

const ProtectRoute = ({ children }) => {
  const location = useLocation();
  const { user, loading, authError } = useAuth();

  if (loading) return <AuthLoading />;

  if (authError) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">Unable to check your session</h1>
        <p className="text-sm text-muted-foreground">
          Refresh the page or sign in again to continue.
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/sign-in"
        replace
        state={{ from: location }}
      />
    );
  }

  if (!user.emailVerified) {
    return (
      <Navigate
        to="/email-verify"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
};

export default ProtectRoute;
