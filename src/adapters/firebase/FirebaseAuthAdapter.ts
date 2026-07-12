import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebaseConfig";
import type { AuthRepositoryPort } from "@/core/ports/AuthRepositoryPort";
import type { AppUser } from "@/core/entities/User";

function mapFirebaseUserToAppUser(
  firebaseUser: FirebaseUser,
  role: "admin" | "reader" = "reader",
): AppUser {
  return {
    id: firebaseUser.uid,
    displayName: firebaseUser.displayName ?? "Usuário",
    email: firebaseUser.email ?? "",
    photoURL: firebaseUser.photoURL,
    role,
  };
}

export class FirebaseAuthAdapter implements AuthRepositoryPort {
  private readonly auth = getFirebaseAuth();
  private readonly googleProvider = new GoogleAuthProvider();

  async loginWithGoogle(): Promise<AppUser> {
    const result = await signInWithPopup(this.auth, this.googleProvider);
    const firebaseUser = result.user;
    console.log(
      "FirebaseAuthAdapter.loginWithGoogle: user logged in",
      firebaseUser,
    );

    // Check if user is admin via custom claims
    const isAdmin = await this.checkIsAdmin(firebaseUser.uid);

    return mapFirebaseUserToAppUser(firebaseUser, isAdmin ? "admin" : "reader");
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async getCurrentUser(): Promise<AppUser | null> {
    const firebaseUser = this.auth.currentUser;

    if (!firebaseUser) {
      return null;
    }

    const isAdmin = await this.checkIsAdmin(firebaseUser.uid);

    return mapFirebaseUserToAppUser(firebaseUser, isAdmin ? "admin" : "reader");
  }

  onAuthStateChanged(callback: (user: AppUser | null) => void): () => void {
    const unsubscribe = onAuthStateChanged(
      this.auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (!firebaseUser) {
          callback(null);
          return;
        }

        const isAdmin = await this.checkIsAdmin(firebaseUser.uid);
        const appUser = mapFirebaseUserToAppUser(
          firebaseUser,
          isAdmin ? "admin" : "reader",
        );
        callback(appUser);
      },
    );

    return unsubscribe;
  }

  async isAdmin(userId: string): Promise<boolean> {
    return this.checkIsAdmin(userId);
  }

  private async checkIsAdmin(uid: string): Promise<boolean> {
    try {
      const firebaseUser = this.auth.currentUser;

      if (!firebaseUser || firebaseUser.uid !== uid) {
        return false;
      }

      const idTokenResult = await firebaseUser.getIdTokenResult();
      console.log(
        "FirebaseAuthAdapter.checkIsAdmin: idTokenResult.claims",
        idTokenResult.claims,
      );
      return idTokenResult.claims.admin === true;
    } catch {
      return false;
    }
  }
}
