import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/layout/context/authProvider";

export const AuthLoading = () => (
  <main
 className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground "
    role="status"
    aria-live="polite"
  >
 <span className="size-8 animate-spin rounded-full border-2 border-border border-t-primary " />
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
