import type { FC } from "react";
import type { Article } from "../../../../core/entities/Article";
import { ArticleCard } from "../ArticleCard";
import { ErrorMessage } from "../../ui/ErrorMessage";
import { Icon } from "../../ui/Icon";

interface ArticleListProps {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

/**
 * ArticleList — Grid de ArticleCards com estados de loading, empty e error.
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
            className="rounded-xl overflow-hidden bg-dracula-current/15 border border-dracula-current/30 animate-pulse"
          >
            <div className="aspect-video bg-gradient-to-br from-dracula-current/50 to-dracula-current/20" />
            <div className="p-5 space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-dracula-current/40" />
                <div className="h-5 w-20 rounded-full bg-dracula-current/40" />
              </div>
              <div className="h-5 bg-dracula-current/40 rounded w-3/4" />
              <div className="h-4 bg-dracula-current/40 rounded w-full" />
              <div className="h-4 bg-dracula-current/40 rounded w-5/6" />
              <div className="flex justify-between pt-3 border-t border-dracula-current/15">
                <div className="h-3 w-24 bg-dracula-current/40 rounded" />
                <div className="h-3 w-20 bg-dracula-current/40 rounded" />
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

  // Empty state — ícone menor, layout mais sutil
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-dracula-current/20 flex items-center justify-center mb-5">
          <Icon name="document" size="lg" className="text-dracula-comment/30" />
        </div>
        <h3 className="text-lg font-semibold text-dracula-fg mb-1">
          Nenhum artigo publicado ainda
        </h3>
        <p className="text-sm text-dracula-comment max-w-md leading-relaxed">
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
