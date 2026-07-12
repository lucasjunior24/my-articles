import { type FC } from "react";
import { useParams, Link } from "react-router-dom";
import { useArticle } from "../../hooks/useArticle";
import { useLike } from "../../hooks/useLike";
import { useAuth } from "../../hooks/useAuth";
import { ArticleContent } from "../../components/article/ArticleContent";
import { LikeButton } from "../../components/likes/LikeButton";
import { LikeCounter } from "../../components/likes/LikeCounter";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

/**
 * ArticlePage — Página de detalhe de um artigo.
 *
 * Carrega o artigo por slug com cache de 10min, renderiza
 * o conteúdo completo com ArticleContent + MarkdownRenderer
 * e exibe o sistema de like/dislike para usuários autenticados.
 *
 * @example
 * ```tsx
 * <ArticlePage />
 * ```
 */
export const ArticlePage: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { article, isLoading, error, refetch } = useArticle(slug);
  const { user } = useAuth();
  const {
    likeCount,
    dislikeCount,
    userVote,
    isLoading: isLikeLoading,
    toggleLike,
    toggleDislike,
  } = useLike(article?.id);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-dracula-comment text-sm animate-pulse">
          Carregando artigo...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  // Not found
  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">📄</span>
        <h1 className="text-2xl font-bold text-dracula-fg mb-2">
          Artigo não encontrado
        </h1>
        <p className="text-dracula-comment mb-6">
          O artigo que você está procurando não existe ou foi removido.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-dracula-pink text-dracula-bg font-medium rounded-lg hover:bg-dracula-pink/90 transition-colors"
        >
          Voltar para Home
        </Link>
      </div>
    );
  }

  // Article content
  return (
    <div className="py-4">
      <ArticleContent article={article} />

      {/* Seção de Like/Dislike */}
      <div className="max-w-3xl mx-auto mt-10 pt-8 border-t border-dracula-current/40">
        <div className="flex flex-col items-center gap-4">
          <LikeButton
            likeCount={likeCount}
            dislikeCount={dislikeCount}
            userVote={userVote}
            isLoading={isLikeLoading}
            isLoggedIn={!!user}
            onLike={toggleLike}
            onDislike={toggleDislike}
          />

          <LikeCounter likeCount={likeCount} dislikeCount={dislikeCount} />

          {/* Mensagem para usuários não logados */}
          {!user && (
            <p className="text-sm text-dracula-comment text-center">
              <Link
                to="/login"
                className="text-dracula-cyan hover:underline font-medium"
              >
                Faça login
              </Link>{" "}
              para avaliar este artigo
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
