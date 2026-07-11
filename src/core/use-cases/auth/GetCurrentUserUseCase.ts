import type { AuthRepositoryPort } from "../../ports/AuthRepositoryPort";
import type { AppUser } from "../../entities/User";

export class GetCurrentUserUseCase {
  private readonly authRepo: AuthRepositoryPort;

  constructor(authRepo: AuthRepositoryPort) {
    this.authRepo = authRepo;
  }

  async execute(): Promise<AppUser | null> {
    return this.authRepo.getCurrentUser();
  }
}
