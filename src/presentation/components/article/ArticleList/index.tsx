import type { FC } from "react";
import type { Article } from "../../../../core/entities/Article";
import { ArticleCard } from "../ArticleCard";
import { ErrorMessage } from "../../ui/ErrorMessage";

interface ArticleListProps {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

/**
 * ArticleList — Grid de ArticleCards com estados de loading, empty e error.
 *
 * @example
 * ```tsx
 * <ArticleList
 *   articles={articles}
 *   isLoading={isLoading}
 *   error={error}
 *   onRetry={refetch}
 * />
 * ```
 */
export const ArticleList: FC<ArticleListProps> = ({
  articles,
  isLoading,
  error,
  onRetry,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden bg-dracula-current/30 border border-dracula-current/50 animate-pulse"
          >
            <div className="aspect-video bg-dracula-current/70" />
            <div className="p-5 space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-dracula-current/70" />
                <div className="h-5 w-20 rounded-full bg-dracula-current/70" />
              </div>
              <div className="h-5 bg-dracula-current/70 rounded w-3/4" />
              <div className="h-4 bg-dracula-current/70 rounded w-full" />
              <div className="h-4 bg-dracula-current/70 rounded w-5/6" />
              <div className="flex justify-between pt-2">
                <div className="h-3 w-24 bg-dracula-current/70 rounded" />
                <div className="h-3 w-20 bg-dracula-current/70 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12">
        <ErrorMessage message={error} {...(onRetry ? { onRetry } : {})} />
      </div>
    );
  }

  // Empty state
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="w-16 h-16 text-dracula-comment/40 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
          />
        </svg>
        <h3 className="text-lg font-medium text-dracula-fg mb-2">
          Nenhum artigo publicado ainda
        </h3>
        <p className="text-sm text-dracula-comment max-w-md">
          Os artigos aparecerão aqui assim que forem publicados. Volte em breve!
        </p>
      </div>
    );
  }

  // Articles grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};
