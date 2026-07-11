import type {
  Article,
  CreateArticleDTO,
  UpdateArticleDTO,
} from "../entities/Article";

export interface ArticleRepositoryPort {
  getAll(): Promise<Article[]>;
  getById(id: string): Promise<Article | null>;
  getBySlug(slug: string): Promise<Article | null>;
  create(
    data: CreateArticleDTO,
    authorId: string,
    authorName: string,
  ): Promise<Article>;
  update(id: string, data: UpdateArticleDTO): Promise<Article>;
  delete(id: string): Promise<void>;
  getByAuthor(authorId: string): Promise<Article[]>;
}
