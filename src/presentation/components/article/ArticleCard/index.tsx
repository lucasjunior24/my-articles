import type { FC } from "react";
import { Link } from "react-router-dom";
import type { Article } from "../../../../core/entities/Article";
import { formatDate } from "../../../../shared/utils/dateFormat";

interface ArticleCardProps {
  article: Article;
}

/**
 * ArticleCard — Card de artigo para listagem.
 *
 * Exibe imagem de capa, tags, título, excerpt, autor e data.
 * O card inteiro é um link para a página do artigo.
 *
 * @example
 * ```tsx
 * <ArticleCard article={article} />
 * ```
 */
export const ArticleCard: FC<ArticleCardProps> = ({ article }) => {
  return (
    <Link
      to={`/artigo/${article.slug}`}
      className="group block rounded-xl overflow-hidden bg-dracula-current/30 border border-dracula-current/50 hover:border-dracula-pink/40 transition-all duration-300 hover:shadow-lg hover:shadow-dracula-pink/5"
    >
      {/* Cover Image */}
      {article.coverImage ? (
        <div className="aspect-video overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-video bg-dracula-current/50 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-dracula-comment/50"
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
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-dracula-purple/20 text-dracula-purple"
              >
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-dracula-current text-dracula-comment">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-dracula-fg group-hover:text-dracula-pink transition-colors duration-200 line-clamp-2 mb-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-dracula-comment line-clamp-3 mb-4">
          {article.excerpt}
        </p>

        {/* Author & Date */}
        <div className="flex items-center justify-between text-xs text-dracula-comment">
          <span className="truncate">{article.authorName}</span>
          <span>{formatDate(article.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};
