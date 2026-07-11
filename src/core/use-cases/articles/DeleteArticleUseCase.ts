import type { ArticleRepositoryPort } from "../../ports/ArticleRepositoryPort";
import type { AuthRepositoryPort } from "../../ports/AuthRepositoryPort";
import type { CachePort } from "../../ports/CachePort";
import { UnauthorizedError } from "../../errors/UnauthorizedError";

export class DeleteArticleUseCase {
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

  async execute(id: string, userId: string): Promise<void> {
    const isAdmin = await this.authRepo.isAdmin(userId);

    if (!isAdmin) {
      throw new UnauthorizedError(
        "Apenas administradores podem deletar artigos",
      );
    }

    await this.articleRepo.delete(id);

    // Invalidate cache after deletion
    await this.cache.invalidateByPrefix("articles_list");
    await this.cache.invalidateByPrefix(`article_slug_`);
  }
}
