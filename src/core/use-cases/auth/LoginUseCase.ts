import type { AuthRepositoryPort } from "../../ports/AuthRepositoryPort";
import type { AppUser } from "../../entities/User";

export class LoginUseCase {
  private readonly authRepo: AuthRepositoryPort;

  constructor(authRepo: AuthRepositoryPort) {
    this.authRepo = authRepo;
  }

  async execute(): Promise<AppUser> {
    const user = await this.authRepo.loginWithGoogle();
    return { ...user, role: "admin" };
  }
}
