import type {
  WriterRequest,
  CreateWriterRequestDTO,
  UpdateWriterRequestDTO,
} from "../entities/WriterRequest";

export interface WriterRequestRepositoryPort {
  /**
   * Cria uma nova solicitação de writer com status "pending".
   */
  createRequest(dto: CreateWriterRequestDTO): Promise<WriterRequest>;

  /**
   * Busca a solicitação mais recente de um usuário específico.
   */
  findByUserId(userId: string): Promise<WriterRequest | null>;

  /**
   * Busca todas as solicitações, opcionalmente filtradas por status.
   */
  findAll(
    status?: "pending" | "approved" | "rejected",
  ): Promise<WriterRequest[]>;

  /**
   * Atualiza o status de uma solicitação (aprovar/rejeitar).
   */
  updateRequest(
    requestId: string,
    dto: UpdateWriterRequestDTO,
  ): Promise<WriterRequest>;
}
