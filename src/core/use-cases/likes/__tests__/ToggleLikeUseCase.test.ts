import { describe, it, expect } from "vitest";
import { ToggleLikeUseCase } from "../ToggleLikeUseCase";
import type { LikeRepositoryPort } from "../../../ports/LikeRepositoryPort";
import type { AuthRepositoryPort } from "../../../ports/AuthRepositoryPort";
import type {
  LikeType,
  ArticleLikesSummary,
} from "../../../entities/LikeDislike";
import type { AppUser } from "../../../entities/User";
import { UnauthorizedError } from "../../../errors/UnauthorizedError";
import { ValidationError } from "../../../errors/ValidationError";

// ─── Mock Factories ──────────────────────────────────────────────────

function makeLikeRepo(): LikeRepositoryPort {
  return {
    toggleLike: async (
      _articleId: string,
      _userId: string,
      type: LikeType,
    ): Promise<ArticleLikesSummary> => ({
      articleId: _articleId,
      likeCount: type === "like" ? 1 : 0,
      dislikeCount: type === "dislike" ? 1 : 0,
      userVote: type,
    }),
    getUserVote: async () => "none",
    getArticleSummary: async () => ({
      articleId: "art-1",
      likeCount: 0,
      dislikeCount: 0,
    }),
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
    isAdmin: async () => false,
    isWriter: async () => false,
  };
}

const loggedInUser: AppUser = {
  id: "user-1",
  displayName: "Usuário",
  email: "user@test.com",
  photoURL: null,
  role: "reader",
};

// ─── Testes ──────────────────────────────────────────────────────────

describe("ToggleLikeUseCase (11.2.3)", () => {
  it("usuário logado pode dar like", async () => {
    const useCase = new ToggleLikeUseCase(
      makeLikeRepo(),
      makeAuthRepo(loggedInUser),
    );
    const result = await useCase.execute("art-1", loggedInUser.id, "like");
    expect(result.userVote).toBe("like");
    expect(result.likeCount).toBe(1);
  });

  it("usuário logado pode dar dislike", async () => {
    const useCase = new ToggleLikeUseCase(
      makeLikeRepo(),
      makeAuthRepo(loggedInUser),
    );
    const result = await useCase.execute("art-1", loggedInUser.id, "dislike");
    expect(result.userVote).toBe("dislike");
    expect(result.dislikeCount).toBe(1);
  });

  it("usuário logado pode remover voto (none)", async () => {
    const useCase = new ToggleLikeUseCase(
      makeLikeRepo(),
      makeAuthRepo(loggedInUser),
    );
    const result = await useCase.execute("art-1", loggedInUser.id, "none");
    expect(result.userVote).toBe("none");
    expect(result.likeCount).toBe(0);
    expect(result.dislikeCount).toBe(0);
  });

  it("usuário NÃO logado não pode votar", async () => {
    const useCase = new ToggleLikeUseCase(makeLikeRepo(), makeAuthRepo(null));
    await expect(useCase.execute("art-1", "any-id", "like")).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("deve rejeitar tipo de voto inválido", async () => {
    const useCase = new ToggleLikeUseCase(
      makeLikeRepo(),
      makeAuthRepo(loggedInUser),
    );
    await expect(
      useCase.execute("art-1", loggedInUser.id, "invalid" as LikeType),
    ).rejects.toThrow(ValidationError);
  });
});
