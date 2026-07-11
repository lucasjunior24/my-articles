import { useDI } from "./useDI";

/**
 * useInjection — Hook para acessar o container DI.
 *
 * Wrapper do useDI para manter consistência com a nomenclatura
 * de hooks da aplicação.
 *
 * @example
 * ```tsx
 * const { getArticlesUseCase } = useInjection();
 * const articles = await getArticlesUseCase.execute(ipHash);
 * ```
 */
export function useInjection() {
  return useDI();
}
