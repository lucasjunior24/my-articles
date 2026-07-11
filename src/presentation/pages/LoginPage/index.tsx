import type { FC } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Icon } from "../../components/ui/Icon";

/**
 * LoginPage — Página de login com Google.
 *
 * Exibe um botão "Entrar com Google" centralizado.
 * Redireciona para a home se o usuário já estiver logado.
 */
export const LoginPage: FC = () => {
  const { user, isLoading, login } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-dracula-comment text-sm">
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dracula-current/20 via-dracula-bg to-dracula-current/15 border border-dracula-current/20 p-8">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-dracula-pink/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-dracula-cyan/5 rounded-full blur-2xl" />

          <div className="relative z-10">
            {/* Icon */}
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-dracula-pink/15 to-dracula-purple/15 flex items-center justify-center">
              <Icon name="login" size="lg" className="text-dracula-pink" />
            </div>

            <div className="text-center mb-7">
              <h1 className="text-xl font-bold text-dracula-fg mb-1">
                Entrar no Blog
              </h1>
              <p className="text-sm text-dracula-comment">
                Faça login para interagir com os artigos
              </p>
            </div>

            {/* Google Login Button — mantém SVG colorido da marca Google */}
            <button
              onClick={login}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Entrar com Google
            </button>

            <p className="mt-5 text-[11px] text-center text-dracula-comment/50 leading-relaxed">
              Ao entrar, você concorda com nossos termos de uso e política de
              privacidade.
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-5">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-dracula-comment hover:text-dracula-cyan transition-colors"
          >
            <Icon name="arrow-left" size="xs" />
            Voltar para o blog
          </a>
        </div>
      </div>
    </div>
  );
};
