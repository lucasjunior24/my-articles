import type { FC } from "react";
import { Button } from "./Button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * ErrorMessage — Mensagem de erro com opção de retry.
 *
 * @example
 * ```tsx
 * <ErrorMessage message="Erro ao carregar artigos" onRetry={refetch} />
 * <ErrorMessage message="Algo deu errado" />
 * ```
 */
export const ErrorMessage: FC<ErrorMessageProps> = ({
  message,
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 p-8 rounded-lg bg-dracula-current/30 ${className}`}
      role="alert"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-3xl">⚠️</span>
        <p className="text-dracula-red text-center font-medium">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
};
