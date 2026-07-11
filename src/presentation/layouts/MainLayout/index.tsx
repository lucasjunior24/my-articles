import type { FC, ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface MainLayoutProps {
  children?: ReactNode;
}

/**
 * MainLayout — Layout principal do blog.
 *
 * Inclui Header com logo, navegação e AuthButton,
 * main content area e Footer.
 * Usa Outlet do React Router para renderizar as páginas filhas.
 *
 * @example
 * ```tsx
 * <MainLayout />
 * ```
 */
export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { user, isLoading, login, logout, isAdmin } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-dracula-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dracula-bg/80 backdrop-blur-md border-b border-dracula-current/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-dracula-pink hover:text-dracula-pink/80 transition-colors"
            >
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
              <span>Blog Lucas</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium text-dracula-fg hover:text-dracula-cyan transition-colors"
              >
                Home
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-dracula-fg hover:text-dracula-cyan transition-colors"
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Auth Button */}
            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-dracula-current animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-dracula-current flex items-center justify-center text-dracula-cyan text-xs font-bold">
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-dracula-fg hidden lg:block">
                      {user.displayName}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 text-sm font-medium text-dracula-red hover:bg-dracula-red/10 rounded-lg transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-dracula-pink text-dracula-bg rounded-lg hover:bg-dracula-pink/90 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Entrar com Google
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children ?? <Outlet />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dracula-current/50 bg-dracula-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-dracula-comment text-sm">
              <svg
                className="w-5 h-5 text-dracula-pink"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
              <span>Blog Lucas &copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-dracula-comment">
              <span>Feito com React + TypeScript + Firebase</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Tema Dracula Dark</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
