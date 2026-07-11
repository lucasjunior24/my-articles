import type { FC } from "react";
import { useParams, Link } from "react-router-dom";
import { useArticle } from "../../hooks/useArticle";
import { ArticleContent } from "../../components/article/ArticleContent";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

/**
 * ArticlePage — Página de detalhe de um artigo.
 *
 * Carrega o artigo por slug com cache de 10min e renderiza
 * o conteúdo completo com ArticleContent + MarkdownRenderer.
 *
 * @example
 * ```tsx
 * <ArticlePage />
 * ```
 */
export const ArticlePage: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { article, isLoading, error, refetch } = useArticle(slug);

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
    </div>
  );
};
