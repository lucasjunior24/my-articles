export type ArticleStatus = "draft" | "published";

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  coverImage: string | null;
  authorId: string;
  authorName: string;
  status: ArticleStatus;
  likeCount: number;
  dislikeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateArticleDTO {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  coverImage?: string;
  status?: ArticleStatus;
}

export interface UpdateArticleDTO {
  title?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  coverImage?: string | null;
  status?: ArticleStatus;
}
