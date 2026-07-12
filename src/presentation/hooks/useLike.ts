import { useState, useEffect, useCallback } from "react";
import { useInjection } from "./useInjection";
import type {
  LikeType,
  ArticleLikesSummary,
} from "../../core/entities/LikeDislike";
import { useAuth } from "./useAuth";

/**
 * useLike — Hook para gerenciar o sistema de like/dislike de um artigo.
 *
 * Carrega o resumo de avaliações (likes, dislikes, voto do usuário)
 * e permite alternar o voto entre like, dislike e nenhum.
 *
 * @param articleId - ID do artigo a ser avaliado
 *
 * @returns Summary com contagens, estado de loading e função toggle
 *
 * @example
 * ```tsx
 * const { likeCount, dislikeCount, userVote, isLoading, toggleLike, toggleDislike } = useLike(articleId);
 * ```
 */
export function useLike(articleId: string | undefined) {
  const { getArticleLikesUseCase, toggleLikeUseCase } = useInjection();
  const { user } = useAuth();

  const [summary, setSummary] = useState<ArticleLikesSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id;

  // Carregar resumo de avaliações ao montar e quando articleId/userId mudar
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!articleId) return;

      setIsLoading(true);
      setError(null);

      try {
        const result = await getArticleLikesUseCase.execute(articleId, userId);
        if (!cancelled) {
          setSummary(result);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Erro ao carregar avaliações";
          console.error("useLike.load error:", err);
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [articleId, userId, getArticleLikesUseCase]);

  // Alternar voto (like/dislike)
  const vote = useCallback(
    async (type: LikeType) => {
      if (!articleId || !userId) return;

      setIsLoading(true);
      setError(null);

      try {
        const result = await toggleLikeUseCase.execute(articleId, userId, type);
        setSummary(result);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao registrar voto";
        console.error("useLike.vote error:", err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [articleId, userId, toggleLikeUseCase],
  );

  const toggleLike = useCallback(() => {
    const currentVote = summary?.userVote ?? "none";
    vote(currentVote === "like" ? "none" : "like");
  }, [vote, summary?.userVote]);

  const toggleDislike = useCallback(() => {
    const currentVote = summary?.userVote ?? "none";
    vote(currentVote === "dislike" ? "none" : "dislike");
  }, [vote, summary?.userVote]);

  return {
    likeCount: summary?.likeCount ?? 0,
    dislikeCount: summary?.dislikeCount ?? 0,
    userVote: summary?.userVote ?? "none",
    isLoading,
    error,
    toggleLike,
    toggleDislike,
    refetch: () => {
      if (!articleId) return;
      setIsLoading(true);
      getArticleLikesUseCase
        .execute(articleId, userId)
        .then(setSummary)
        .catch((err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : "Erro ao recarregar avaliações";
          setError(message);
        })
        .finally(() => setIsLoading(false));
    },
  };
}
