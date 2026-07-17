import { describe, it, expect } from "vitest";
import { CreateArticleUseCase } from "../CreateArticleUseCase";
import type { ArticleRepositoryPort } from "../../../ports/ArticleRepositoryPort";
import type { AuthRepositoryPort } from "../../../ports/AuthRepositoryPort";
import type { Article, CreateArticleDTO } from "../../../entities/Article";
import type { AppUser } from "../../../entities/User";
import { UnauthorizedError } from "../../../errors/UnauthorizedError";
import { ValidationError } from "../../../errors/ValidationError";

// ─── Mock Helpers ────────────────────────────────────────────────────

function makeArticleRepo(): ArticleRepositoryPort {
  return {
    getAll: async () => [],
    getById: async () => null,
    getBySlug: async () => null,
    create: async (
      data: CreateArticleDTO,
      authorId: string,
      authorName: string,
    ): Promise<Article> => ({
      id: "art-1",
      title: data.title,
      slug: "meu-artigo",
      content: data.content,
      excerpt: data.excerpt,
      tags: data.tags,
      coverImage: data.coverImage ?? null,
      authorId,
      authorName,
      status: data.status ?? "draft",
      likeCount: 0,
      dislikeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    update: async () => {
      throw new Error("not implemented");
    },
    delete: async () => {},
    getByAuthor: async () => [],
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

const validArticleData: CreateArticleDTO = {
  title: "Meu Artigo Incrível",
  content: "Este é o conteúdo do artigo, com mais de 10 caracteres.",
  excerpt: "Resumo do artigo para listagem.",
  tags: ["react", "typescript"],
};

const writerUser: AppUser = {
  id: "user-writer",
  displayName: "Escritor",
  email: "writer@test.com",
  photoURL: null,
  role: "writer",
};

const adminUser: AppUser = {
  id: "user-admin",
  displayName: "Admin",
  email: "admin@test.com",
  photoURL: null,
  role: "admin",
};

const readerUser: AppUser = {
  id: "user-reader",
  displayName: "Leitor",
  email: "reader@test.com",
  photoURL: null,
  role: "reader",
};

// ─── Testes ──────────────────────────────────────────────────────────

describe("CreateArticleUseCase (11.2.1)", () => {
  it("writer pode criar artigo", async () => {
    const useCase = new CreateArticleUseCase(
      makeArticleRepo(),
      makeAuthRepo(writerUser),
    );
    const result = await useCase.execute(validArticleData, writerUser.id);
    expect(result.title).toBe(validArticleData.title);
  });

  it("admin pode criar artigo", async () => {
    const useCase = new CreateArticleUseCase(
      makeArticleRepo(),
      makeAuthRepo(adminUser),
    );
    const result = await useCase.execute(validArticleData, adminUser.id);
    expect(result.title).toBe(validArticleData.title);
  });

  it("reader NÃO pode criar artigo", async () => {
    const useCase = new CreateArticleUseCase(
      makeArticleRepo(),
      makeAuthRepo(readerUser),
    );
    await expect(
      useCase.execute(validArticleData, readerUser.id),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("usuário não autenticado NÃO pode criar artigo", async () => {
    const useCase = new CreateArticleUseCase(
      makeArticleRepo(),
      makeAuthRepo(null),
    );
    await expect(useCase.execute(validArticleData, "any-id")).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("deve rejeitar título inválido (vazio)", async () => {
    const useCase = new CreateArticleUseCase(
      makeArticleRepo(),
      makeAuthRepo(writerUser),
    );
    await expect(
      useCase.execute({ ...validArticleData, title: "" }, writerUser.id),
    ).rejects.toThrow(ValidationError);
  });

  it("deve rejeitar título muito curto (< 3 caracteres)", async () => {
    const useCase = new CreateArticleUseCase(
      makeArticleRepo(),
      makeAuthRepo(writerUser),
    );
    await expect(
      useCase.execute({ ...validArticleData, title: "ab" }, writerUser.id),
    ).rejects.toThrow(ValidationError);
  });

  it("deve rejeitar conteúdo inválido (menos de 10 caracteres)", async () => {
    const useCase = new CreateArticleUseCase(
      makeArticleRepo(),
      makeAuthRepo(writerUser),
    );
    await expect(
      useCase.execute({ ...validArticleData, content: "Curto" }, writerUser.id),
    ).rejects.toThrow(ValidationError);
  });

  it("deve rejeitar excerpt inválido (menos de 10 caracteres)", async () => {
    const useCase = new CreateArticleUseCase(
      makeArticleRepo(),
      makeAuthRepo(writerUser),
    );
    await expect(
      useCase.execute({ ...validArticleData, excerpt: "Curto" }, writerUser.id),
    ).rejects.toThrow(ValidationError);
  });

  it("deve rejeitar tags vazias", async () => {
    const useCase = new CreateArticleUseCase(
      makeArticleRepo(),
      makeAuthRepo(writerUser),
    );
    await expect(
      useCase.execute({ ...validArticleData, tags: [] }, writerUser.id),
    ).rejects.toThrow(ValidationError);
  });

  it("deve usar status 'draft' como padrão", async () => {
    const useCase = new CreateArticleUseCase(
      makeArticleRepo(),
      makeAuthRepo(writerUser),
    );
    const result = await useCase.execute(validArticleData, writerUser.id);
    expect(result.status).toBe("draft");
  });

  it("deve aceitar status 'published' explícito", async () => {
    const useCase = new CreateArticleUseCase(
      makeArticleRepo(),
      makeAuthRepo(writerUser),
    );
    const result = await useCase.execute(
      { ...validArticleData, status: "published" },
      writerUser.id,
    );
    expect(result.status).toBe("published");
  });
});
