import type { FC } from "react";
import { Link } from "react-router-dom";
import type { Article } from "../../../../core/entities/Article";
import { formatDate } from "../../../../shared/utils/dateFormat";
import { Icon } from "../../ui/Icon";

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
      className="group block rounded-xl overflow-hidden bg-dracula-current/15 border border-dracula-current/30 hover:border-dracula-pink/30 transition-all duration-300 hover:shadow-lg hover:shadow-dracula-pink/5 hover:-translate-y-0.5"
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
        <div className="aspect-video bg-gradient-to-br from-dracula-current/40 to-dracula-current/15 flex items-center justify-center">
          <Icon name="photo" size="xl" className="text-dracula-comment/25" />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-dracula-purple/15 text-dracula-purple border border-dracula-purple/10"
              >
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-dracula-current/40 text-dracula-comment border border-dracula-current/30">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-base font-semibold text-dracula-fg group-hover:text-dracula-pink transition-colors duration-200 line-clamp-2 mb-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-dracula-comment/75 line-clamp-2 mb-4 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Author & Date */}
        <div className="flex items-center justify-between pt-3 border-t border-dracula-current/15 text-xs text-dracula-comment">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-dracula-purple/15 flex items-center justify-center">
              <Icon name="user" size="xs" className="text-dracula-purple" />
            </div>
            <span className="truncate font-medium text-dracula-fg/60 max-w-[100px]">
              {article.authorName}
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <Icon name="calendar" size="xs" />
            {formatDate(article.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
};
