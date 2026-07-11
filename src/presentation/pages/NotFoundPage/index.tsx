import type { FC } from "react";
import { Link } from "react-router-dom";

/**
 * NotFoundPage — Página 404 para rotas não encontradas.
 *
 * Exibe uma mensagem amigável com link para voltar à home.
 */
export const NotFoundPage: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* Large 404 with gradient */}
      <div className="relative mb-8">
        <span className="text-[10rem] md:text-[12rem] font-bold text-dracula-current/20 select-none leading-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl md:text-7xl">🔍</span>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-dracula-fg mb-3">
        Página não encontrada
      </h1>
      <p className="text-dracula-comment text-lg max-w-md mb-10 leading-relaxed">
        A página que você está procurando não existe, foi removida ou está
        temporariamente indisponível.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-dracula-pink text-dracula-bg font-semibold rounded-xl hover:bg-dracula-pink/90 transition-all duration-200 shadow-lg shadow-dracula-pink/20"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          Voltar para Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-dracula-current/50 text-dracula-fg font-semibold rounded-xl hover:bg-dracula-current transition-all duration-200 border border-dracula-current/50"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
            />
          </svg>
          Voltar
        </button>
      </div>
    </div>
  );
};
