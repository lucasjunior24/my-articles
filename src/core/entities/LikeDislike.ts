export type LikeType = "like" | "dislike" | "none";

export interface LikeDislike {
  userId: string;
  articleId: string;
  type: LikeType;
  createdAt: Date;
}

export interface ArticleLikesSummary {
  articleId: string;
  likeCount: number;
  dislikeCount: number;
  userVote: LikeType;
}
