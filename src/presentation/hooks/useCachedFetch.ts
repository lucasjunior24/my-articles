import { useState, useEffect, useCallback, useRef } from "react";
import type { AsyncState } from "../../shared/types/common";

/**
 * useCachedFetch — Hook genérico para buscar dados com cache.
 *
 * Gerencia estados de loading, success e error automaticamente.
 * Suporta refetch manual e cancelamento ao desmontar.
 *
 * @param fetchFn - Função assíncrona que retorna os dados
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useCachedFetch(
 *   () => getArticlesUseCase.execute(ipHash),
 * );
 * ```
 */
export function useCachedFetch<T>(fetchFn: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: "idle" });
  const fetchFnRef = useRef(fetchFn);

  // Keep ref in sync inside effects, not during render
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  });

  const execute = useCallback(async () => {
    setState({ status: "loading" });

    try {
      const data = await fetchFnRef.current();
      setState({ status: "success", data });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setState({ status: "error", error: message });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setState({ status: "loading" });

      try {
        const data = await fetchFnRef.current();

        if (!cancelled) {
          setState({ status: "success", data });
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Erro desconhecido";
          setState({ status: "error", error: message });
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    data: state.status === "success" ? state.data : undefined,
    isLoading: state.status === "loading" || state.status === "idle",
    error: state.status === "error" ? state.error : null,
    refetch: execute,
  };
}
