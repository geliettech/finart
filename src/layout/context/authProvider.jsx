import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from "@/services/firebase";
import {
  refreshCurrentUser,
  signOutUser,
} from "@/services/auth";

const AuthContext = createContext(null);

const normalizeUser = (currentUser) => {
  if (!currentUser) return null;

  return {
    uid: currentUser.uid,
    email: currentUser.email,
    emailVerified: currentUser.emailVerified,
    displayName: currentUser.displayName ?? "",
    photoURL: currentUser.photoURL ?? "",
    name: currentUser.displayName ?? "",
    profilePic: currentUser.photoURL ?? "",
    userID: currentUser.uid,
    isAuth: true,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(normalizeUser(currentUser));
        setAuthError(null);
        setLoading(false);
      },
      (error) => {
        setAuthError(error);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const refreshUser = useCallback(async () => {
    const currentUser = await refreshCurrentUser();
    const nextUser = normalizeUser(currentUser);
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(async () => {
    await signOutUser();
    setUser(null);
    navigate("/sign-in", { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      isAuthenticated: Boolean(user?.emailVerified),
      refreshUser,
      logout,
    }),
    [user, loading, authError, refreshUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
