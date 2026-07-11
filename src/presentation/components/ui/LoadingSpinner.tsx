import type { FC } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses: Record<NonNullable<LoadingSpinnerProps["size"]>, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-3",
  lg: "w-12 h-12 border-4",
};

/**
 * LoadingSpinner — Um spinner de carregamento animado no estilo Dracula Dark.
 *
 * @example
 * ```tsx
 * <LoadingSpinner size="md" />
 * <LoadingSpinner size="lg" className="mt-4" />
 * ```
 */
export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  return (
    <div
      className={`${sizeClasses[size]} rounded-full border-dracula-current border-t-dracula-cyan animate-spin ${className}`}
      role="status"
      aria-label="Carregando..."
    />
  );
};
