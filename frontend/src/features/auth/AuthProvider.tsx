import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "@/api/auth";
import type { LoginCredentials, User } from "@/types";

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login(credentials: LoginCredentials): Promise<User>;
  logout(): Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components -- context object is consumed by route guards and tests
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authVersion = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const version = authVersion.current;

    async function loadCurrentUser() {
      try {
        const currentUser = await getCurrentUser();

        if (!cancelled && authVersion.current === version) {
          setUser(currentUser);
        }
      } catch {
        // Anonymous visitors and failed session lookups are both unauthenticated.
        if (!cancelled && authVersion.current === version) {
          setUser(null);
        }
      } finally {
        if (!cancelled && authVersion.current === version) {
          setIsLoading(false);
        }
      }
    }

    void loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    // Invalidate any in-flight mount lookup so a late response cannot undo login.
    authVersion.current += 1;
    setIsLoading(false);

    const currentUser = await loginRequest(credentials);
    setUser(currentUser);

    return currentUser;
  }, []);

  const logout = useCallback(async () => {
    // Invalidate any in-flight mount lookup so a late response cannot restore the user.
    authVersion.current += 1;
    setIsLoading(false);

    try {
      await logoutRequest();
    } finally {
      // Clear the local session even if the request fails; the rejection still propagates.
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook belongs with its provider
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
