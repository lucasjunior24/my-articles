import type { ArticleRepositoryPort } from "../../ports/ArticleRepositoryPort";
import type { CachePort } from "../../ports/CachePort";
import type { Article } from "../../entities/Article";
import { CACHE_TTL } from "../../../shared/constants/cache";

export class GetArticlesUseCase {
  private readonly articleRepo: ArticleRepositoryPort;
  private readonly cache: CachePort;

  constructor(articleRepo: ArticleRepositoryPort, cache: CachePort) {
    this.articleRepo = articleRepo;
    this.cache = cache;
  }

  async execute(ipHash: string): Promise<Article[]> {
    const cacheKey = `articles_list_${ipHash}`;
    const cached = await this.cache.get<Article[]>(cacheKey);

    if (cached) {
      return cached.data;
    }

    const articles = await this.articleRepo.getAll();
    const publishedArticles = articles.filter((a) => a.status === "published");

    await this.cache.set(cacheKey, publishedArticles, CACHE_TTL.ARTICLES_LIST);

    return publishedArticles;
  }
}
