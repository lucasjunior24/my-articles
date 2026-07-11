import { useContext } from "react";
import {
  AuthContext,
  type AuthContextValue,
} from "../contexts/AuthContextDefinition";

/**
 * Hook to access authentication state and actions.
 * Must be used within an <AuthProvider>.
 *
 * @returns {AuthContextValue} The auth context value
 *   - user: The current user or null
 *   - isLoading: Whether auth state is being determined
 *   - isAdmin: Whether the current user is an admin
 *   - login: Function to login with Google
 *   - logout: Function to logout
 *
 * @throws If used outside of AuthProvider
 *
 * @example
 * ```tsx
 * const { user, isLoading, isAdmin, login, logout } = useAuth();
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }

  return context;
}
