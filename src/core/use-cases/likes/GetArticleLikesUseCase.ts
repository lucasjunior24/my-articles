import type { LikeRepositoryPort } from "../../ports/LikeRepositoryPort";
import type { AuthRepositoryPort } from "../../ports/AuthRepositoryPort";
import type { ArticleLikesSummary } from "../../entities/LikeDislike";

export class GetArticleLikesUseCase {
  private readonly likeRepo: LikeRepositoryPort;
  private readonly authRepo: AuthRepositoryPort;

  constructor(likeRepo: LikeRepositoryPort, authRepo: AuthRepositoryPort) {
    this.likeRepo = likeRepo;
    this.authRepo = authRepo;
  }

  async execute(
    articleId: string,
    userId?: string,
  ): Promise<ArticleLikesSummary> {
    const summary = await this.likeRepo.getArticleSummary(articleId);

    let userVote: "like" | "dislike" | "none" = "none";

    if (userId) {
      userVote = await this.likeRepo.getUserVote(articleId, userId);
    }

    return {
      ...summary,
      userVote,
    };
  }
}
