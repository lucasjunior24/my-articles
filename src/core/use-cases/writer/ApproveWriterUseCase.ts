import type { AuthRepositoryPort } from "../../ports/AuthRepositoryPort";
import type { WriterRequestRepositoryPort } from "../../ports/WriterRequestRepositoryPort";
import type { WriterRequest } from "../../entities/WriterRequest";
import { UnauthorizedError } from "../../errors/UnauthorizedError";

/**
 * Caso de uso: Admin aprova ou rejeita uma solicitação de writer.
 *
 * Regras:
 * - Apenas admin pode aprovar/rejeitar
 * - Se aprovado, a custom claim `writer: true` deve ser setada via Admin SDK
 *   (feito externamente, este use case apenas atualiza o status no Firestore)
 */
export class ApproveWriterUseCase {
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
    requestId: string,
    status: "approved" | "rejected",
    reviewerId: string,
    reviewerDisplayName: string,
  ): Promise<WriterRequest> {
    const reviewer = await this.authRepo.getCurrentUser();

    if (!reviewer || reviewer.id !== reviewerId) {
      throw new UnauthorizedError("Usuário não autenticado");
    }

    if (reviewer.role !== "admin") {
      throw new UnauthorizedError(
        "Apenas administradores podem gerenciar solicitações",
      );
    }

    const updated = await this.writerRequestRepo.updateRequest(requestId, {
      status,
      reviewedBy: reviewerDisplayName,
    });

    return updated;
  }
}
