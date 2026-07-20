import { useState, type FC, type MouseEvent } from "react";
import type { LikeType } from "../../../../core/entities/LikeDislike";

interface LikeButtonProps {
  /** Contagem de likes */
  likeCount: number;
  /** Contagem de dislikes */
  dislikeCount: number;
  /** Voto atual do usuário */
  userVote: LikeType;
  /** Se está carregando/salvando */
  isLoading?: boolean;
  /** Se o usuário está logado (desabilita se não estiver) */
  isLoggedIn?: boolean;
  /** Callback ao clicar em like */
  onLike: () => void;
  /** Callback ao clicar em dislike */
  onDislike: () => void;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * LikeButton — Componente de avaliação de artigos com like/dislike.
 *
 * Exibe botões de like e dislike com ícones SVG, estado ativo/inativo
 * com cores do tema Dracula, contadores de votos e desabilita se o
 * usuário não estiver logado.
 *
 * Inclui animação "like-pop" ao clicar (Sprint 12.1.2).
 *
 * @example
 * ```tsx
 * <LikeButton
 *   likeCount={42}
 *   dislikeCount={3}
 *   userVote="like"
 *   isLoggedIn={true}
 *   onLike={handleLike}
 *   onDislike={handleDislike}
 * />
 * ```
 */
export const LikeButton: FC<LikeButtonProps> = ({
  likeCount,
  dislikeCount,
  userVote,
  isLoading = false,
  isLoggedIn = false,
  onLike,
  onDislike,
  className = "",
}) => {
  const [likePop, setLikePop] = useState(false);
  const [dislikePop, setDislikePop] = useState(false);

  const isDisabled = isLoading || !isLoggedIn;

  const handleLikeClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled) {
      onLike();
      setLikePop(true);
      setTimeout(() => setLikePop(false), 300);
    }
  };

  const handleDislikeClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled) {
      onDislike();
      setDislikePop(true);
      setTimeout(() => setDislikePop(false), 300);
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-4 rounded-xl border border-dracula-current/40 bg-dracula-bg/80 px-4 py-2.5 ${className}`}
      role="group"
      aria-label="Avaliação do artigo"
    >
      {/* Botão Like */}
      <button
        type="button"
        onClick={handleLikeClick}
        disabled={isDisabled}
        title={isLoggedIn ? "Gostei" : "Faça login para avaliar"}
        aria-label={`Like (${likeCount})`}
        aria-pressed={userVote === "like"}
        className={`
          inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dracula-green focus-visible:ring-offset-1 focus-visible:ring-offset-dracula-bg
          disabled:cursor-not-allowed disabled:opacity-40
          ${
            userVote === "like"
              ? "text-dracula-green"
              : "text-dracula-comment hover:text-dracula-green/80"
          }
        `}
      >
        {/* Thumbs Up SVG */}
        <svg
          className={`w-5 h-5 shrink-0 transition-transform duration-200 hover:scale-110 ${likePop ? "animate-like-pop" : ""}`}
          viewBox="0 0 24 24"
          fill={userVote === "like" ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V2.75a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
          />
        </svg>
        <span>{likeCount}</span>
      </button>

      {/* Separador visual */}
      <span
        className="block w-px h-5 bg-dracula-current/40"
        aria-hidden="true"
      />

      {/* Botão Dislike */}
      <button
        type="button"
        onClick={handleDislikeClick}
        disabled={isDisabled}
        title={isLoggedIn ? "Não gostei" : "Faça login para avaliar"}
        aria-label={`Dislike (${dislikeCount})`}
        aria-pressed={userVote === "dislike"}
        className={`
          inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dracula-red focus-visible:ring-offset-1 focus-visible:ring-offset-dracula-bg
          disabled:cursor-not-allowed disabled:opacity-40
          ${
            userVote === "dislike"
              ? "text-dracula-red"
              : "text-dracula-comment hover:text-dracula-red/80"
          }
        `}
      >
        {/* Thumbs Down SVG */}
        <svg
          className={`w-5 h-5 shrink-0 transition-transform duration-200 hover:scale-110 ${dislikePop ? "animate-like-pop" : ""}`}
          viewBox="0 0 24 24"
          fill={userVote === "dislike" ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 01-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.75 2.25 2.25 0 009.75 22a.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.001M16.5 15.25c1.03 0 1.81-.453 2.331-1.203a11.952 11.952 0 001.169-4.172 12.1 12.1 0 00-.521-3.507c-.26-.85-1.084-1.368-1.973-1.368H16.5m0 0h-4.23"
          />
        </svg>
        <span>{dislikeCount}</span>
      </button>

      {/* Indicador de loading */}
      {isLoading && (
        <span
          className="inline-block w-4 h-4 border-2 border-dracula-comment border-t-dracula-pink rounded-full animate-spin ml-1"
          aria-hidden="true"
        />
      )}
    </div>
  );
};
