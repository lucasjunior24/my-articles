import { useInjection } from "./useInjection";
import { useCachedFetch } from "./useCachedFetch";
import type { Article } from "../../core/entities/Article";

/**
 * useArticles — Hook para listar artigos publicados com cache.
 *
 * Utiliza o GetArticlesUseCase que já implementa cache de 5min.
 *
 * @example
 * ```tsx
 * const { articles, isLoading, error, refetch } = useArticles();
 * ```
 */
export function useArticles() {
  const { getArticlesUseCase, cacheAdapter } = useInjection();

  const fetchArticles = async (): Promise<Article[]> => {
    const ipHash = await cacheAdapter.getIpHash();
    return getArticlesUseCase.execute(ipHash);
  };

  const { data, isLoading, error, refetch } = useCachedFetch(fetchArticles);

  return {
    articles: data ?? [],
    isLoading,
    error,
    refetch,
  };
}
