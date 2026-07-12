import type { FC } from "react";
import { Link } from "react-router-dom";
import { useArticles } from "../../hooks/useArticles";
import { ArticleList } from "../../components/article/ArticleList";
import { Icon } from "../../components/ui/Icon";
import { RequestWriterButton } from "@/presentation/components/writer/RequestWriterButton";

/**
 * HomePage — Página inicial do blog.
 *
 * Exibe uma hero section com título, subtítulo e call-to-action,
 * seguida por um grid de artigos publicados com cache de 5min.
 */
export const HomePage: FC = () => {
  const { articles, isLoading, error, refetch } = useArticles();

  return (
    <div className="space-y-12">
      {/* Hero Section — mais contida */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dracula-current/25 via-dracula-bg to-dracula-current/10 border border-dracula-current/20 p-8 md:p-10 lg:p-14">
        {/* Background decoration — reduzida */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-dracula-pink/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-dracula-cyan/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dracula-purple/10 border border-dracula-purple/15 text-dracula-purple text-xs font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-dracula-purple animate-pulse" />
            Blog pessoal
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dracula-fg mb-3 leading-tight">
            Blog do{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-dracula-pink to-dracula-purple">
              Lucas
            </span>
          </h1>

          <p className="text-base md:text-lg text-dracula-comment max-w-xl mx-auto mb-7 leading-relaxed">
            Artigos sobre desenvolvimento web, React, TypeScript e boas práticas
            de programação.
          </p>

          {/* CTA Buttons — mais compactos */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#articles"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-dracula-pink text-dracula-bg font-semibold rounded-lg hover:bg-dracula-pink/90 transition-all duration-200 text-sm shadow-md shadow-dracula-pink/10"
            >
              <Icon name="document" size="sm" />
              Ver Artigos
            </a>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-dracula-current/40 text-dracula-fg font-semibold rounded-lg hover:bg-dracula-current/60 transition-all duration-200 text-sm border border-dracula-current/40"
            >
              <Icon name="login" size="sm" />
              Entrar / Cadastrar
            </Link>
          </div>

          {/* Stats indicator */}
          <div className="mt-6 flex items-center justify-center gap-5 text-xs text-dracula-comment">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-dracula-green animate-pulse" />
              <span>Últimos artigos</span>
            </div>
            {!isLoading && !error && (
              <div className="flex items-center gap-1.5">
                <Icon name="document" size="xs" className="text-dracula-cyan" />
                <span>
                  {articles.length} artigo{articles.length !== 1 ? "s" : ""}{" "}
                  publicado{articles.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <RequestWriterButton></RequestWriterButton>

      {/* Articles Section */}
      <section id="articles">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-dracula-fg">
              Artigos Recentes
            </h2>
            <p className="text-sm text-dracula-comment mt-0.5">
              Confira os últimos conteúdos publicados
            </p>
          </div>
          {!isLoading && !error && articles.length > 6 && (
            <Link
              to="#all"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-dracula-cyan hover:text-dracula-cyan/80 transition-colors"
            >
              Ver todos
              <Icon name="arrow-right" size="sm" />
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
