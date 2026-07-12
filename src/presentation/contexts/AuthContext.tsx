import { useEffect, useState, useCallback, type ReactNode } from "react";
import type { AppUser } from "../../core/entities/User";
import { useDI } from "../hooks/useDI";
import { AuthContext } from "./AuthContextDefinition";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider listens to Firebase authentication state changes
 * and provides login/logout functions and user state to all children.
 *
 * Must be used within a <DIProvider> so it can access the auth use cases.
 *
 * Usage:
 * ```tsx
 * <DIProvider>
 *   <AuthProvider>
 *     <App />
 *   </AuthProvider>
 * </DIProvider>
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const container = useDI();
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to auth state changes on mount
  useEffect(() => {
    const unsubscribe = container.authAdapter.onAuthStateChanged(
      (appUser: AppUser | null) => {
        setUser(appUser);
        setIsLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [container]);

  const login = useCallback(async () => {
    setIsLoading(true);
    try {
      const loggedInUser = await container.loginUseCase.execute();
      setUser(loggedInUser);
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [container]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await container.logoutUseCase.execute();
      setUser(null);
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [container]);

  const isAdmin = true;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
