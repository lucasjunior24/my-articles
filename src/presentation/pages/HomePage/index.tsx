import type { FC } from "react";
import { Link } from "react-router-dom";
import { useArticles } from "../../hooks/useArticles";
import { ArticleList } from "../../components/article/ArticleList";

/**
 * HomePage — Página inicial do blog.
 *
 * Exibe uma hero section com título, subtítulo e call-to-action,
 * seguida por um grid de artigos publicados com cache de 5min.
 */
export const HomePage: FC = () => {
  const { articles, isLoading, error, refetch } = useArticles();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dracula-current/40 via-dracula-bg to-dracula-current/20 border border-dracula-current/30 p-8 md:p-12 lg:p-16">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-dracula-pink/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-dracula-cyan/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dracula-purple/10 border border-dracula-purple/20 text-dracula-purple text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-dracula-purple animate-pulse" />
            Blog pessoal
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dracula-fg mb-4 leading-tight">
            Blog do{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-dracula-pink to-dracula-purple">
              Lucas
            </span>
          </h1>

          <p className="text-lg md:text-xl text-dracula-comment max-w-2xl mx-auto mb-8 leading-relaxed">
            Artigos sobre desenvolvimento web, React, TypeScript e boas práticas
            de programação. Acompanhe minhas experiências e aprendizados.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="#articles"
              className="inline-flex items-center gap-2 px-6 py-3 bg-dracula-pink text-dracula-bg font-semibold rounded-xl hover:bg-dracula-pink/90 transition-all duration-200 shadow-lg shadow-dracula-pink/20 hover:shadow-dracula-pink/30"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                />
              </svg>
              Ver Artigos
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-dracula-current/50 text-dracula-fg font-semibold rounded-xl hover:bg-dracula-current transition-all duration-200 border border-dracula-current/50"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              Entrar / Cadastrar
            </Link>
          </div>

          {/* Stats indicator */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-dracula-comment">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-dracula-green animate-pulse" />
              <span>Últimos artigos</span>
            </div>
            {!isLoading && !error && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-dracula-cyan"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                <span>
                  {articles.length} artigo{articles.length !== 1 ? "s" : ""}{" "}
                  publicado{articles.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-dracula-fg">
              Artigos Recentes
            </h2>
            <p className="text-dracula-comment text-sm mt-1">
              Confira os últimos conteúdos publicados
            </p>
          </div>
          {!isLoading && !error && articles.length > 6 && (
            <Link
              to="#all"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-dracula-cyan hover:text-dracula-cyan/80 transition-colors"
            >
              Ver todos
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          )}
        </div>
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
