import type { LikeType, ArticleLikesSummary } from "../entities/LikeDislike";

export interface LikeRepositoryPort {
  toggleLike(
    articleId: string,
    userId: string,
    type: LikeType,
  ): Promise<ArticleLikesSummary>;
  getUserVote(articleId: string, userId: string): Promise<LikeType>;
  getArticleSummary(
    articleId: string,
  ): Promise<Omit<ArticleLikesSummary, "userVote">>;
}
