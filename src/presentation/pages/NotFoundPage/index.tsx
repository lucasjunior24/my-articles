import type { FC } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";

/**
 * NotFoundPage — Página 404 para rotas não encontradas.
 *
 * Exibe uma mensagem amigável com link para voltar à home.
 */
export const NotFoundPage: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* Large 404 */}
      <div className="relative mb-8">
        <span className="text-[8rem] md:text-[10rem] font-bold text-dracula-current/15 select-none leading-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            name="search"
            size="xl"
            className="text-dracula-comment/40 w-10 h-10 md:w-12 md:h-12"
          />
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-dracula-fg mb-2">
        Página não encontrada
      </h1>
      <p className="text-sm text-dracula-comment max-w-md mb-8 leading-relaxed">
        A página que você está procurando não existe, foi removida ou está
        temporariamente indisponível.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-dracula-pink text-dracula-bg font-semibold rounded-lg hover:bg-dracula-pink/90 transition-all duration-200 text-sm"
        >
          <Icon name="home" size="sm" />
          Voltar para Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-dracula-current/40 text-dracula-fg font-semibold rounded-lg hover:bg-dracula-current/60 transition-all duration-200 text-sm border border-dracula-current/40"
        >
          <Icon name="arrow-left" size="sm" />
          Voltar
        </button>
      </div>
    </div>
  );
};
