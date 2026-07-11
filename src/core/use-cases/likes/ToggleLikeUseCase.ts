import type { LikeRepositoryPort } from "../../ports/LikeRepositoryPort";
import type { AuthRepositoryPort } from "../../ports/AuthRepositoryPort";
import type { ArticleLikesSummary, LikeType } from "../../entities/LikeDislike";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { ValidationError } from "../../errors/ValidationError";

export class ToggleLikeUseCase {
  private readonly likeRepo: LikeRepositoryPort;
  private readonly authRepo: AuthRepositoryPort;

  constructor(likeRepo: LikeRepositoryPort, authRepo: AuthRepositoryPort) {
    this.likeRepo = likeRepo;
    this.authRepo = authRepo;
  }

  async execute(
    articleId: string,
    userId: string,
    type: LikeType,
  ): Promise<ArticleLikesSummary> {
    const user = await this.authRepo.getCurrentUser();

    if (!user) {
      throw new UnauthorizedError(
        "Você precisa estar logado para avaliar artigos",
      );
    }

    if (type !== "like" && type !== "dislike" && type !== "none") {
      throw new ValidationError("Tipo de avaliação inválido");
    }

    return this.likeRepo.toggleLike(articleId, userId, type);
  }
}
