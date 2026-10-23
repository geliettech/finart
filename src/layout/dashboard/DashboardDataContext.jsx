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
  const [collectionErrors, setCollectionErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const clearError = useCallback(() => setCollectionErrors({}), []);

  useEffect(() => {
    setTransactions([]);
    setBudgets([]);
    setRecurring([]);
    setCollectionErrors({});
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
    const onError = (listenerError, collectionName = "financial data") => {
      const collectionLabel = {
        transactions: "transactions",
        budgets: "budgets",
        recurring: "recurring schedules",
      }[collectionName] || collectionName;
      const messageByCode = {
        "permission-denied": `Firestore denied access to ${collectionLabel}. Confirm the deployed rules allow this verified user to access only their own records, and that existing records have the correct userId.`,
        "failed-precondition": collectionName === "transactions"
          ? "Firestore is missing the transactions query index. Deploy the index in firestore.indexes.json (userId ascending, createdAt descending) to the Firebase project and wait for it to finish building."
          : `Firestore rejected the ${collectionLabel} query because the project configuration or query prerequisites are not ready.`,
        unauthenticated: "Your Firebase session is no longer valid. Sign out, sign back in, and try again.",
        unavailable: "Firestore is temporarily unavailable. Check your connection and try again.",
        "deadline-exceeded": "Firestore took too long to load your data. Check your connection and try again.",
        "resource-exhausted": "The Firebase project has reached a usage limit. Check the project's Firestore quota and billing status.",
        "not-found": "The Firestore database was not found for this Firebase project. Create or select the project's Firestore database.",
      };
      const message = messageByCode[listenerError?.code]
        || `Could not load ${collectionLabel} from Firestore${listenerError?.code ? ` (${listenerError.code})` : ""}. Check the Firebase project configuration and try again.`;
      setCollectionErrors((current) => ({ ...current, [collectionName]: message }));
      setLoading(false);
    };

    let unsubscribe;
    try {
      unsubscribe = subscribeToDashboardData(user.uid, {
        onTransactions: (items, collectionName) => {
          setTransactions(items);
          setCollectionErrors((current) => {
            const next = { ...current };
            delete next[collectionName];
            return next;
          });
          markReady("transactions");
        },
        onBudgets: (items, collectionName) => {
          setBudgets(items);
          setCollectionErrors((current) => {
            const next = { ...current };
            delete next[collectionName];
            return next;
          });
          markReady("budgets");
        },
        onRecurring: (items, collectionName) => {
          setRecurring(items);
          setCollectionErrors((current) => {
            const next = { ...current };
            delete next[collectionName];
            return next;
          });
          markReady("recurring");
        },
        onError,
      });
    } catch (listenerError) {
      onError(listenerError);
    }

    return () => unsubscribe?.();
  }, [user?.uid]);

  const error = Object.values(collectionErrors).join(" ");
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
