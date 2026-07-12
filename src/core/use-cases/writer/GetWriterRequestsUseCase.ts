import type { AuthRepositoryPort } from "../../ports/AuthRepositoryPort";
import type { WriterRequestRepositoryPort } from "../../ports/WriterRequestRepositoryPort";
import type {
  WriterRequest,
  WriterRequestStatus,
} from "../../entities/WriterRequest";
import { UnauthorizedError } from "../../errors/UnauthorizedError";

/**
 * Caso de uso: Admin lista solicitações de writer.
 *
 * Regras:
 * - Apenas admin pode listar solicitações
 * - Opcionalmente filtra por status
 */
export class GetWriterRequestsUseCase {
  private readonly authRepo: AuthRepositoryPort;
  private readonly writerRequestRepo: WriterRequestRepositoryPort;

  constructor(
    authRepo: AuthRepositoryPort,
    writerRequestRepo: WriterRequestRepositoryPort,
  ) {
    this.authRepo = authRepo;
    this.writerRequestRepo = writerRequestRepo;
  }

  async execute(
    userId: string,
    status?: WriterRequestStatus,
  ): Promise<WriterRequest[]> {
    const user = await this.authRepo.getCurrentUser();

    if (!user || user.id !== userId) {
      throw new UnauthorizedError("Usuário não autenticado");
    }

    if (user.role !== "admin") {
      throw new UnauthorizedError(
        "Apenas administradores podem ver solicitações",
      );
    }

    return this.writerRequestRepo.findAll(status);
  }
}
