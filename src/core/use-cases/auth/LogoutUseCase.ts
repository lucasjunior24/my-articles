import type { AuthRepositoryPort } from "../../ports/AuthRepositoryPort";

export class LogoutUseCase {
  private readonly authRepo: AuthRepositoryPort;

  constructor(authRepo: AuthRepositoryPort) {
    this.authRepo = authRepo;
  }

  async execute(): Promise<void> {
    await this.authRepo.logout();
  }
}
