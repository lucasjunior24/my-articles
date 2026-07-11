import type { LikeRepositoryPort } from "../../ports/LikeRepositoryPort";
import type { ArticleLikesSummary, LikeType } from "../../entities/LikeDislike";

export class GetArticleLikesUseCase {
  private readonly likeRepo: LikeRepositoryPort;

  constructor(likeRepo: LikeRepositoryPort) {
    this.likeRepo = likeRepo;
  }

  async execute(
    articleId: string,
    userId?: string,
  ): Promise<ArticleLikesSummary> {
    const summary = await this.likeRepo.getArticleSummary(articleId);

    let userVote: LikeType = "none";

    if (userId) {
      userVote = await this.likeRepo.getUserVote(articleId, userId);
    }

    return {
      ...summary,
      userVote,
    };
  }
}
