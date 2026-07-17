import { describe, it, expect } from "vitest";
import { ApproveWriterUseCase } from "../ApproveWriterUseCase";
import type { AuthRepositoryPort } from "../../../ports/AuthRepositoryPort";
import type { WriterRequestRepositoryPort } from "../../../ports/WriterRequestRepositoryPort";
import type { WriterRequest } from "../../../entities/WriterRequest";
import type { AppUser } from "../../../entities/User";
import { UnauthorizedError } from "../../../errors/UnauthorizedError";

// ─── Mock Factories ──────────────────────────────────────────────────

function makeWriterRequestRepo(): WriterRequestRepositoryPort & {
  getLastUpdated: () => WriterRequest | null;
} {
  let lastUpdated: WriterRequest | null = null;

  return {
    getLastUpdated: () => lastUpdated,
    createRequest: async () => {
      throw new Error("not implemented");
    },
    findByUserId: async () => null,
    findAll: async () => [],
    updateRequest: async (_id, dto): Promise<WriterRequest> => {
      const updated: WriterRequest = {
        id: _id,
        userId: "user-1",
        userEmail: "user@test.com",
        userDisplayName: "Usuário",
        status: dto.status,
        requestedAt: new Date(),
        reviewedAt: new Date(),
        reviewedBy: dto.reviewedBy,
      };
      lastUpdated = updated;
      return updated;
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

describe("ApproveWriterUseCase (11.2.5)", () => {
  it("admin pode aprovar solicitação", async () => {
    const repo = makeWriterRequestRepo();
    const useCase = new ApproveWriterUseCase(makeAuthRepo(adminUser), repo);
    const result = await useCase.execute(
      "req-1",
      "approved",
      adminUser.id,
      adminUser.displayName,
    );
    expect(result.status).toBe("approved");
    expect(result.reviewedBy).toBe(adminUser.displayName);
  });

  it("admin pode rejeitar solicitação", async () => {
    const repo = makeWriterRequestRepo();
    const useCase = new ApproveWriterUseCase(makeAuthRepo(adminUser), repo);
    const result = await useCase.execute(
      "req-1",
      "rejected",
      adminUser.id,
      adminUser.displayName,
    );
    expect(result.status).toBe("rejected");
    expect(result.reviewedBy).toBe(adminUser.displayName);
  });

  it("não-admin (writer) NÃO pode aprovar", async () => {
    const useCase = new ApproveWriterUseCase(
      makeAuthRepo(writerUser),
      makeWriterRequestRepo(),
    );
    await expect(
      useCase.execute(
        "req-1",
        "approved",
        writerUser.id,
        writerUser.displayName,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("usuário não autenticado NÃO pode aprovar", async () => {
    const useCase = new ApproveWriterUseCase(
      makeAuthRepo(null),
      makeWriterRequestRepo(),
    );
    await expect(
      useCase.execute("req-1", "approved", "any-id", "Alguém"),
    ).rejects.toThrow(UnauthorizedError);
  });
});
