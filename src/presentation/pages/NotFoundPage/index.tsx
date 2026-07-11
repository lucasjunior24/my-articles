import type { FC } from "react";
import { Link } from "react-router-dom";

/**
 * NotFoundPage — Página 404 para rotas não encontradas.
 *
 * Exibe uma mensagem amigável com link para voltar à home.
 *
 * @example
 * ```tsx
 * <NotFoundPage />
 * ```
 */
export const NotFoundPage: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <span className="text-8xl font-bold text-dracula-current/50 select-none">
        404
      </span>
      <h1 className="text-3xl font-bold text-dracula-fg mt-4 mb-2">
        Página não encontrada
      </h1>
      <p className="text-dracula-comment max-w-md mb-8">
        A página que você está procurando não existe, foi removida ou está
        temporariamente indisponível.
      </p>
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-dracula-pink text-dracula-bg font-medium rounded-lg hover:bg-dracula-pink/90 transition-colors"
        >
          Voltar para Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-dracula-current text-dracula-fg font-medium rounded-lg hover:bg-dracula-current/80 transition-colors"
        >
          Voltar
        </button>
      </div>
    </div>
  );
};
