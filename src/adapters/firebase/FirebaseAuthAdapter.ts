import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebaseConfig";
import type { AuthRepositoryPort } from "@/core/ports/AuthRepositoryPort";
import type { AppUser, UserRole } from "@/core/entities/User";

function mapFirebaseUserToAppUser(
  firebaseUser: FirebaseUser,
  role: UserRole = "reader",
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

    const role = await this.determineRole(firebaseUser.uid);

    return mapFirebaseUserToAppUser(firebaseUser, role);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async getCurrentUser(): Promise<AppUser | null> {
    const firebaseUser = this.auth.currentUser;

    if (!firebaseUser) {
      return null;
    }

    const role = await this.determineRole(firebaseUser.uid);

    return mapFirebaseUserToAppUser(firebaseUser, role);
  }

  onAuthStateChanged(callback: (user: AppUser | null) => void): () => void {
    const unsubscribe = onAuthStateChanged(
      this.auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (!firebaseUser) {
          callback(null);
          return;
        }

        const role = await this.determineRole(firebaseUser.uid);
        const appUser = mapFirebaseUserToAppUser(firebaseUser, role);
        callback(appUser);
      },
    );

    return unsubscribe;
  }

  async isAdmin(userId: string): Promise<boolean> {
    return this.checkIsAdmin(userId);
  }

  async isWriter(userId: string): Promise<boolean> {
    return this.checkIsWriter(userId);
  }

  /**
   * Determina a role do usuário com a seguinte precedência:
   * admin > writer > reader
   *
   * Se o usuário tiver ambas as claims admin e writer, será tratado como admin.
   */
  private async determineRole(uid: string): Promise<UserRole> {
    const [isAdmin, isWriter] = await Promise.all([
      this.checkIsAdmin(uid),
      this.checkIsWriter(uid),
    ]);

    if (isAdmin) return "admin";
    if (isWriter) return "writer";
    return "reader";
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

  private async checkIsWriter(uid: string): Promise<boolean> {
    try {
      const firebaseUser = this.auth.currentUser;

      if (!firebaseUser || firebaseUser.uid !== uid) {
        return false;
      }

      const idTokenResult = await firebaseUser.getIdTokenResult();
      console.log(
        "FirebaseAuthAdapter.checkIsWriter: idTokenResult.claims",
        idTokenResult.claims,
      );
      return idTokenResult.claims.writer === true;
    } catch {
      return false;
    }
  }
}
