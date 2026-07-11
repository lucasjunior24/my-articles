import type { FC } from "react";
import type { Article } from "../../../../core/entities/Article";
import { formatDate } from "../../../../shared/utils/dateFormat";
import { MarkdownRenderer } from "../MarkdownRenderer";

interface ArticleContentProps {
  article: Article;
}

/**
 * ArticleContent — Layout completo de um artigo.
 *
 * Exibe título, autor, data de publicação, tags, imagem de capa
 * e o conteúdo renderizado em Markdown.
 *
 * @example
 * ```tsx
 * <ArticleContent article={article} />
 * ```
 */
export const ArticleContent: FC<ArticleContentProps> = ({ article }) => {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-dracula-purple/20 text-dracula-purple"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dracula-fg leading-tight mb-4">
          {article.title}
        </h1>

        {/* Author & Date */}
        <div className="flex items-center gap-3 text-sm text-dracula-comment">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-dracula-current flex items-center justify-center text-dracula-cyan text-xs font-bold">
              {article.authorName.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-dracula-fg">
              {article.authorName}
            </span>
          </div>
          <span className="text-dracula-comment">•</span>
          <time dateTime={article.createdAt.toISOString()}>
            {formatDate(article.createdAt)}
          </time>
          {article.updatedAt > article.createdAt && (
            <>
              <span className="text-dracula-comment">•</span>
              <span className="text-dracula-comment text-xs">
                Atualizado em {formatDate(article.updatedAt)}
              </span>
            </>
          )}
        </div>
      </header>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="mb-12">
        <MarkdownRenderer content={article.content} />
      </div>

      {/* Footer */}
      <footer className="border-t border-dracula-current pt-6 mt-8">
        <div className="flex items-center justify-between text-sm text-dracula-comment">
          <span>
            Publicado por{" "}
            <span className="font-medium text-dracula-fg">
              {article.authorName}
            </span>
          </span>
          <span>
            {article.likeCount} curtidas • {article.dislikeCount} dislikes
          </span>
        </div>
      </footer>
    </article>
  );
};
