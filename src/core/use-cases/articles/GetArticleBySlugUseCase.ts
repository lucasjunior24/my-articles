import type { ArticleRepositoryPort } from "../../ports/ArticleRepositoryPort";
import type { CachePort } from "../../ports/CachePort";
import type { Article } from "../../entities/Article";
import { CACHE_TTL } from "../../../shared/constants/cache";

export class GetArticleBySlugUseCase {
  private readonly articleRepo: ArticleRepositoryPort;
  private readonly cache: CachePort;

  constructor(articleRepo: ArticleRepositoryPort, cache: CachePort) {
    this.articleRepo = articleRepo;
    this.cache = cache;
  }

  async execute(slug: string, ipHash: string): Promise<Article | null> {
    const cacheKey = `article_slug_${slug}_${ipHash}`;
    const cached = await this.cache.get<Article>(cacheKey);

    if (cached) {
      return cached.data;
    }

    const article = await this.articleRepo.getBySlug(slug);

    if (article) {
      await this.cache.set(cacheKey, article, CACHE_TTL.ARTICLE_DETAIL);
    }

    return article;
  }
}
