import type { FC } from "react";
import { formatDateRelative } from "../../../shared/utils/dateFormat";

interface CacheIndicatorProps {
  cachedAt: Date | null;
  className?: string;
}

/**
 * CacheIndicator — Badge que indica quando os dados foram armazenados em cache.
 *
 * @example
 * ```tsx
 * <CacheIndicator cachedAt={new Date()} />
 * ```
 */
export const CacheIndicator: FC<CacheIndicatorProps> = ({
  cachedAt,
  className = "",
}) => {
  if (!cachedAt) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-dracula-current/50 text-dracula-comment ${className}`}
      title={`Dados em cache desde ${cachedAt.toLocaleString("pt-BR")}`}
    >
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
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <span>Dados em cache • {formatDateRelative(cachedAt)}</span>
    </div>
  );
};
