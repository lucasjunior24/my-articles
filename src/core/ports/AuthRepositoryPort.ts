import type { AppUser } from "../entities/User";

export interface AuthRepositoryPort {
  loginWithGoogle(): Promise<AppUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AppUser | null>;
  onAuthStateChanged(callback: (user: AppUser | null) => void): () => void;
  isAdmin(userId: string): Promise<boolean>;
  isWriter(userId: string): Promise<boolean>;
}
