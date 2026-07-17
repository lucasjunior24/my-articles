import { describe, it, expect, vi } from "vitest";
import { GetArticlesUseCase } from "../GetArticlesUseCase";
import type { ArticleRepositoryPort } from "../../../ports/ArticleRepositoryPort";
import type { CachePort } from "../../../ports/CachePort";
import type { Article } from "../../../entities/Article";
import type { CacheEntry } from "../../../entities/CacheEntry";
import { CACHE_TTL } from "../../../../shared/constants/cache";

// ─── Mock Factories ──────────────────────────────────────────────────

const publishedArticle: Article = {
  id: "art-1",
  title: "Publicado",
  slug: "publicado",
  content: "Conteúdo do artigo publicado.",
  excerpt: "Resumo do artigo.",
  tags: ["test"],
  coverImage: null,
  authorId: "user-1",
  authorName: "Autor",
  status: "published",
  likeCount: 0,
  dislikeCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const draftArticle: Article = {
  ...publishedArticle,
  id: "art-2",
  title: "Rascunho",
  slug: "rascunho",
  status: "draft",
};

function makeArticleRepo(articles: Article[]): ArticleRepositoryPort {
  return {
    getAll: async () => articles,
    getById: async () => null,
    getBySlug: async () => null,
    create: async () => {
      throw new Error("not implemented");
    },
    update: async () => {
      throw new Error("not implemented");
    },
    delete: async () => {},
    getByAuthor: async () => [],
  };
}

function makeCache(): CachePort {
  const store = new Map<string, CacheEntry<unknown>>();

  return {
    get: async <T>(key: string) => {
      const entry = store.get(key);
      return (entry as CacheEntry<T> | undefined) ?? null;
    },
    set: async <T>(key: string, data: T, ttl: number) => {
      store.set(key, { data, timestamp: Date.now(), ttl, ipHash: "test" });
    },
    invalidate: async (key: string) => {
      store.delete(key);
    },
    invalidateByPrefix: async (prefix: string) => {
      for (const key of store.keys()) {
        if (key.startsWith(prefix)) store.delete(key);
      }
    },
  };
}

// ─── Testes ──────────────────────────────────────────────────────────

describe("GetArticlesUseCase (11.2.2)", () => {
  const IP_HASH = "abc123";

  it("deve retornar apenas artigos publicados", async () => {
    const useCase = new GetArticlesUseCase(
      makeArticleRepo([publishedArticle, draftArticle]),
      makeCache(),
    );
    const result = await useCase.execute(IP_HASH);
    expect(result).toHaveLength(1);
    expect(result[0]!.status).toBe("published");
  });

  it("deve retornar do cache no segundo acesso (cache hit)", async () => {
    const articleRepo = makeArticleRepo([publishedArticle]);
    const cache = makeCache();
    const useCase = new GetArticlesUseCase(articleRepo, cache);

    // Primeiro acesso — sem cache
    const spy = vi.spyOn(articleRepo, "getAll");
    const result1 = await useCase.execute(IP_HASH);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result1).toHaveLength(1);

    // Segundo acesso — deve vir do cache
    const result2 = await useCase.execute(IP_HASH);
    expect(spy).toHaveBeenCalledTimes(1); // ainda só foi chamado 1 vez
    expect(result2).toHaveLength(1);
  });

  it("deve ir ao repositório no cache miss (TTL expirado)", async () => {
    const articleRepo = makeArticleRepo([publishedArticle]);
    const cache = makeCache();
    const useCase = new GetArticlesUseCase(articleRepo, cache);

    // Insere item expirado manualmente
    await cache.set("articles_list_abc123", [], 0); // TTL = 0 (expirado)
    const spy = vi.spyOn(articleRepo, "getAll");

    const result = await useCase.execute(IP_HASH);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
  });

  it("deve usar TTL de ARTICLES_LIST (5 minutos)", async () => {
    const cache = makeCache();
    const useCase = new GetArticlesUseCase(
      makeArticleRepo([publishedArticle]),
      cache,
    );

    await useCase.execute(IP_HASH);

    const entry = await cache.get<Article[]>(`articles_list_${IP_HASH}`);
    expect(entry).not.toBeNull();
    expect(entry!.ttl).toBe(CACHE_TTL.ARTICLES_LIST);
  });
});
