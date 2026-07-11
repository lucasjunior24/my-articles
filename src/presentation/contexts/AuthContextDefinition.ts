import { createContext } from "react";
import type { AppUser } from "../../core/entities/User";

export interface AuthContextValue {
  user: AppUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
