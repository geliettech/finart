import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/layout/context/authProvider";
import { subscribeToDashboardData } from "@/services/dashboardData";

const DashboardDataContext = createContext(null);

export const DashboardDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const clearError = useCallback(() => setError(""), []);

  useEffect(() => {
    setTransactions([]);
    setBudgets([]);
    setRecurring([]);
    setError("");
    setLoading(true);

    if (!user?.uid) {
      setLoading(false);
      return undefined;
    }

    const loaded = new Set();
    const markReady = (name) => {
      loaded.add(name);
      if (loaded.size === 3) setLoading(false);
    };
    const onError = (listenerError) => {
      setError(
        listenerError.code === "permission-denied"
          ? "Firestore denied access. Confirm that the deployed rules allow this signed-in user to access only their own data."
          : "Financial data could not be loaded. Check your connection and try again.",
      );
      setLoading(false);
    };

    let unsubscribe;
    try {
      unsubscribe = subscribeToDashboardData(user.uid, {
        onTransactions: (items) => {
          setTransactions(items);
          markReady("transactions");
        },
        onBudgets: (items) => {
          setBudgets(items);
          markReady("budgets");
        },
        onRecurring: (items) => {
          setRecurring(items);
          markReady("recurring");
        },
        onError,
      });
    } catch (listenerError) {
      onError(listenerError);
    }

    return () => unsubscribe?.();
  }, [user?.uid]);

  const value = useMemo(
    () => ({
      transactions,
      budgets,
      recurring,
      loading,
      error,
      searchTerm,
      setSearchTerm,
      clearError,
    }),
    [transactions, budgets, recurring, loading, error, searchTerm, clearError],
  );

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
};

export const useDashboardData = () => {
  const value = useContext(DashboardDataContext);
  if (!value) {
    throw new Error("useDashboardData must be used inside DashboardDataProvider.");
  }
  return value;
};
