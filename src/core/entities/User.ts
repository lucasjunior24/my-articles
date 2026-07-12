export type UserRole = "admin" | "writer" | "reader";

export interface AppUser {
  id: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  role: UserRole;
}

export interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
}
