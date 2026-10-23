import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/layout/context/authProvider";
import { getSafeReturnTo } from "@/utils/authNavigation";
import { AuthLoading } from "./useRoute";

const GuestRoute = ({ children }) => {
  const location = useLocation();
  const { user, loading, authError } = useAuth();

  if (loading) return <AuthLoading />;

  if (authError) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">Unable to check your session</h1>
        <p className="text-sm text-muted-foreground">
          Refresh the page or try again in a moment.
        </p>
      </main>
    );
  }

  if (user && !user.emailVerified) {
    return (
      <Navigate
        to="/email-verify"
        replace
        state={{ from: location.state?.from }}
      />
    );
  }

  if (user) {
    return (
      <Navigate
        to={getSafeReturnTo(location.state)}
        replace
      />
    );
  }

  return children;
};

export default GuestRoute;
