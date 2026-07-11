import type { FC, ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AuthButton } from "../../components/auth/AuthButton";

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
  const { isAdmin } = useAuth();

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
            <AuthButton />
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
              <span className="hidden sm:inline">&bull;</span>
              <span className="hidden sm:inline">Tema Dracula Dark</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
