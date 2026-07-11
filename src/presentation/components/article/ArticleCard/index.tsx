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
 */
export const ArticleCard: FC<ArticleCardProps> = ({ article }) => {
  return (
    <Link
      to={`/artigo/${article.slug}`}
      className="group block rounded-xl overflow-hidden bg-dracula-current/20 border border-dracula-current/40 hover:border-dracula-pink/30 transition-all duration-300 hover:shadow-xl hover:shadow-dracula-pink/5 hover:-translate-y-1"
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
        <div className="aspect-video bg-gradient-to-br from-dracula-current/60 to-dracula-current/30 flex items-center justify-center">
          <svg
            className="w-14 h-14 text-dracula-comment/30"
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
      <div className="p-5 md:p-6">
        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-dracula-purple/15 text-dracula-purple border border-dracula-purple/10"
              >
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-dracula-current/50 text-dracula-comment border border-dracula-current/30">
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
        <p className="text-sm text-dracula-comment/80 line-clamp-3 mb-4 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Author & Date */}
        <div className="flex items-center justify-between pt-3 border-t border-dracula-current/20 text-xs text-dracula-comment">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-dracula-purple/20 flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-dracula-purple"
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
            </div>
            <span className="truncate font-medium text-dracula-fg/70">
              {article.authorName}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            {formatDate(article.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
};
