import type { FC } from "react";
import { useArticles } from "../../hooks/useArticles";
import { ArticleList } from "../../components/article/ArticleList";

/**
 * HomePage — Página inicial do blog.
 *
 * Exibe uma hero section com título e subtítulo,
 * seguida por um grid de artigos publicados com cache de 5min.
 *
 * @example
 * ```tsx
 * <HomePage />
 * ```
 */
export const HomePage: FC = () => {
  const { articles, isLoading, error, refetch } = useArticles();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dracula-fg mb-4">
          Blog do <span className="text-dracula-pink">Lucas</span>
        </h1>
        <p className="text-lg md:text-xl text-dracula-comment max-w-2xl mx-auto">
          Artigos sobre desenvolvimento web, React, TypeScript e boas práticas
          de programação.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-dracula-comment">
          <span className="inline-block w-2 h-2 rounded-full bg-dracula-green animate-pulse" />
          <span>Últimos artigos</span>
        </div>
      </section>

      {/* Articles Section */}
      <section>
        <ArticleList
          articles={articles}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        />
      </section>
    </div>
  );
};
