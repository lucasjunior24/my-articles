import { describe, it, expect } from "vitest";
import { RequestWriterUseCase } from "../RequestWriterUseCase";
import type { AuthRepositoryPort } from "../../../ports/AuthRepositoryPort";
import type { WriterRequestRepositoryPort } from "../../../ports/WriterRequestRepositoryPort";
import type { WriterRequest } from "../../../entities/WriterRequest";
import type { AppUser } from "../../../entities/User";
import { UnauthorizedError } from "../../../errors/UnauthorizedError";

// ─── Mock Factories ──────────────────────────────────────────────────

function makeWriterRequestRepo(
  existingRequest: WriterRequest | null,
): WriterRequestRepositoryPort {
  const requests: WriterRequest[] = existingRequest ? [existingRequest] : [];

  return {
    createRequest: async (dto) => ({
      id: "req-1",
      userId: dto.userId,
      userEmail: dto.userEmail,
      userDisplayName: dto.userDisplayName,
      status: "pending",
      requestedAt: new Date(),
      reviewedAt: undefined,
      reviewedBy: undefined,
    }),
    findByUserId: async (userId: string) => {
      return requests.find((r) => r.userId === userId) ?? null;
    },
    findAll: async () => requests,
    updateRequest: async () => {
      throw new Error("not implemented");
    },
  };
}

function makeAuthRepo(user: AppUser | null): AuthRepositoryPort {
  return {
    loginWithGoogle: async () => {
      throw new Error("not implemented");
    },
    logout: async () => {},
    getCurrentUser: async () => user,
    onAuthStateChanged: () => () => {},
    isAdmin: async () => user?.role === "admin",
    isWriter: async () => user?.role === "writer",
  };
}

const readerUser: AppUser = {
  id: "reader-1",
  displayName: "Leitor",
  email: "reader@test.com",
  photoURL: null,
  role: "reader",
};

const adminUser: AppUser = {
  id: "admin-1",
  displayName: "Admin",
  email: "admin@test.com",
  photoURL: null,
  role: "admin",
};

const writerUser: AppUser = {
  id: "writer-1",
  displayName: "Escritor",
  email: "writer@test.com",
  photoURL: null,
  role: "writer",
};

// ─── Testes ──────────────────────────────────────────────────────────

describe("RequestWriterUseCase (11.2.4)", () => {
  it("reader sem solicitação pode solicitar", async () => {
    const useCase = new RequestWriterUseCase(
      makeAuthRepo(readerUser),
      makeWriterRequestRepo(null),
    );
    const result = await useCase.execute(readerUser.id);
    expect(result.status).toBe("pending");
    expect(result.userId).toBe(readerUser.id);
  });

  it("admin NÃO pode solicitar (já é admin)", async () => {
    const useCase = new RequestWriterUseCase(
      makeAuthRepo(adminUser),
      makeWriterRequestRepo(null),
    );
    await expect(useCase.execute(adminUser.id)).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("writer NÃO pode solicitar (já é writer)", async () => {
    const useCase = new RequestWriterUseCase(
      makeAuthRepo(writerUser),
      makeWriterRequestRepo(null),
    );
    await expect(useCase.execute(writerUser.id)).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("reader com solicitação pendente NÃO pode criar duplicata", async () => {
    const existingRequest: WriterRequest = {
      id: "req-existing",
      userId: readerUser.id,
      userEmail: readerUser.email,
      userDisplayName: readerUser.displayName,
      status: "pending",
      requestedAt: new Date(),
      reviewedAt: undefined,
      reviewedBy: undefined,
    };
    const useCase = new RequestWriterUseCase(
      makeAuthRepo(readerUser),
      makeWriterRequestRepo(existingRequest),
    );
    await expect(useCase.execute(readerUser.id)).rejects.toThrow(
      "Você já possui uma solicitação pendente",
    );
  });

  it("reader com solicitação rejeitada PODE solicitar novamente", async () => {
    const rejectedRequest: WriterRequest = {
      id: "req-rejected",
      userId: readerUser.id,
      userEmail: readerUser.email,
      userDisplayName: readerUser.displayName,
      status: "rejected",
      requestedAt: new Date(),
      reviewedAt: new Date(),
      reviewedBy: "admin-1",
    };
    const useCase = new RequestWriterUseCase(
      makeAuthRepo(readerUser),
      makeWriterRequestRepo(rejectedRequest),
    );
    const result = await useCase.execute(readerUser.id);
    expect(result.status).toBe("pending");
  });

  it("não autenticado NÃO pode solicitar", async () => {
    const useCase = new RequestWriterUseCase(
      makeAuthRepo(null),
      makeWriterRequestRepo(null),
    );
    await expect(useCase.execute("any-id")).rejects.toThrow(UnauthorizedError);
  });
});
