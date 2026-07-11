import type { FC } from "react";
import { formatDateRelative } from "../../../shared/utils/dateFormat";
import { Icon } from "./Icon";

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
      <Icon name="refresh" size="xs" />
      <span>Dados em cache • {formatDateRelative(cachedAt)}</span>
    </div>
  );
};
