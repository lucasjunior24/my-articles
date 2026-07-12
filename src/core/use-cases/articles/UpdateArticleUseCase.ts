import type { ArticleRepositoryPort } from "../../ports/ArticleRepositoryPort";
import type { AuthRepositoryPort } from "../../ports/AuthRepositoryPort";
import type { CachePort } from "../../ports/CachePort";
import type { Article, UpdateArticleDTO } from "../../entities/Article";

import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { ValidationError } from "../../errors/ValidationError";

export class UpdateArticleUseCase {
  private readonly articleRepo: ArticleRepositoryPort;
  private readonly authRepo: AuthRepositoryPort;
  private readonly cache: CachePort;

  constructor(
    articleRepo: ArticleRepositoryPort,
    authRepo: AuthRepositoryPort,
    cache: CachePort,
  ) {
    this.articleRepo = articleRepo;
    this.authRepo = authRepo;
    this.cache = cache;
  }

  async execute(
    id: string,
    data: UpdateArticleDTO,
    userId: string,
  ): Promise<Article> {
    if (data.title !== undefined && data.title.trim().length < 3) {
      throw new ValidationError(
        "O título do artigo deve ter pelo menos 3 caracteres",
      );
    }

    if (data.content !== undefined && data.content.trim().length < 10) {
      throw new ValidationError(
        "O conteúdo do artigo deve ter pelo menos 10 caracteres",
      );
    }

    const user = await this.authRepo.getCurrentUser();

    if (!user || user.id !== userId) {
      throw new UnauthorizedError("Usuário não autenticado");
    }

    // Apenas writer e admin podem editar artigos
    if (user.role !== "writer" && user.role !== "admin") {
      throw new UnauthorizedError(
        "Apenas escritores e administradores podem editar artigos",
      );
    }

    const article = await this.articleRepo.update(id, data);

    // Invalidate cache after update
    await this.cache.invalidateByPrefix("articles_list");
    await this.cache.invalidateByPrefix(`article_slug_${article.slug}`);

    return article;
  }
}
