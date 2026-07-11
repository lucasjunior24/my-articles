import { useInjection } from "./useInjection";
import { useCachedFetch } from "./useCachedFetch";
import type { Article } from "../../core/entities/Article";

/**
 * useArticle — Hook para buscar um artigo por slug com cache.
 *
 * Utiliza o GetArticleBySlugUseCase que já implementa cache de 10min.
 *
 * @param slug - Slug do artigo a ser buscado
 *
 * @example
 * ```tsx
 * const { article, isLoading, error } = useArticle("meu-artigo");
 * ```
 */
export function useArticle(slug: string | undefined) {
  const { getArticleBySlugUseCase, cacheAdapter } = useInjection();

  const fetchArticle = async (): Promise<Article | null> => {
    if (!slug) return null;
    const ipHash = await cacheAdapter.getIpHash();
    return getArticleBySlugUseCase.execute(slug, ipHash);
  };

  const { data, isLoading, error, refetch } = useCachedFetch(fetchArticle);

  return {
    article: data ?? null,
    isLoading,
    error,
    refetch,
  };
}
