import type { AuthRepositoryPort } from "../../ports/AuthRepositoryPort";
import type { WriterRequestRepositoryPort } from "../../ports/WriterRequestRepositoryPort";
import type { WriterRequest } from "../../entities/WriterRequest";
import { UnauthorizedError } from "../../errors/UnauthorizedError";

/**
 * Caso de uso: Reader solicita para se tornar Writer.
 *
 * Regras:
 * - Usuário deve estar autenticado
 * - Apenas readers podem solicitar (não admin, não writer)
 * - Não pode criar solicitação duplicada pendente
 */
export class RequestWriterUseCase {
  private readonly authRepo: AuthRepositoryPort;
  private readonly writerRequestRepo: WriterRequestRepositoryPort;

  constructor(
    authRepo: AuthRepositoryPort,
    writerRequestRepo: WriterRequestRepositoryPort,
  ) {
    this.authRepo = authRepo;
    this.writerRequestRepo = writerRequestRepo;
  }

  async execute(userId: string): Promise<WriterRequest> {
    const user = await this.authRepo.getCurrentUser();

    if (!user || user.id !== userId) {
      throw new UnauthorizedError("Usuário não autenticado");
    }

    // Apenas readers podem solicitar
    if (user.role === "admin") {
      throw new UnauthorizedError("Administradores não precisam solicitar");
    }
    if (user.role === "writer") {
      throw new UnauthorizedError("Você já é um escritor");
    }

    // Verifica se já existe uma solicitação pendente
    const existing = await this.writerRequestRepo.findByUserId(userId);
    if (existing && existing.status === "pending") {
      throw new Error("Você já possui uma solicitação pendente");
    }

    // Cria a solicitação
    console.log("Criando solicitação de writer para usuário: ", user.id);
    const request = await this.writerRequestRepo.createRequest({
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName,
    });

    return request;
  }
}
