import type { FC } from "react";

interface LikeCounterProps {
  /** Total de likes */
  likeCount: number;
  /** Total de dislikes */
  dislikeCount: number;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * LikeCounter — Exibe total de likes e dislikes com barra de proporção visual.
 *
 * Mostra os números absolutos e uma barra horizontal que representa
 * visualmente a proporção entre likes e dislikes usando as cores
 * do tema Dracula (verde para likes, vermelho para dislikes).
 *
 * @example
 * ```tsx
 * <LikeCounter likeCount={42} dislikeCount={3} />
 * ```
 */
export const LikeCounter: FC<LikeCounterProps> = ({
  likeCount,
  dislikeCount,
  className = "",
}) => {
  const total = likeCount + dislikeCount;
  const likePercentage = total > 0 ? (likeCount / total) * 100 : 50;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Labels com contagens */}
      <div className="flex items-center justify-between text-xs text-dracula-comment">
        <span className="flex items-center gap-1">
          <span
            className="w-1.5 h-1.5 rounded-full bg-dracula-green"
            aria-hidden="true"
          />
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </span>
        <span className="flex items-center gap-1">
          {dislikeCount} {dislikeCount === 1 ? "dislike" : "dislikes"}
          <span
            className="w-1.5 h-1.5 rounded-full bg-dracula-red"
            aria-hidden="true"
          />
        </span>
      </div>

      {/* Barra de proporção */}
      <div
        className="w-full h-1.5 rounded-full bg-dracula-current/30 overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(likePercentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${Math.round(likePercentage)}% de avaliações positivas`}
      >
        <div
          className="h-full rounded-full bg-dracula-green transition-all duration-500 ease-out"
          style={{ width: `${likePercentage}%` }}
        />
      </div>

      {/* Percentual numérico */}
      <p className="text-xs text-dracula-comment text-center">
        {total > 0
          ? `${Math.round(likePercentage)}% avaliaram positivamente`
          : "Nenhuma avaliação ainda"}
      </p>
    </div>
  );
};
