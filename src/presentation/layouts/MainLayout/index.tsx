import type { FC, ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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
 */
export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? "bg-dracula-pink/15 text-dracula-pink shadow-sm"
        : "text-dracula-fg hover:bg-dracula-current/50 hover:text-dracula-cyan"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-dracula-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dracula-bg/90 backdrop-blur-lg border-b border-dracula-current/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 text-xl font-bold text-dracula-pink hover:text-dracula-pink/80 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-dracula-pink/15 flex items-center justify-center group-hover:bg-dracula-pink/25 transition-colors">
                <svg
                  className="w-5 h-5"
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
              </div>
              <span className="hidden sm:inline">Blog Lucas</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Link to="/" className={navLinkClass("/")}>
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
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
                  Home
                </span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className={navLinkClass("/admin")}>
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                      />
                    </svg>
                    Painel Admin
                  </span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          {children ?? <Outlet />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dracula-current/30 bg-dracula-bg/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-dracula-comment text-sm">
              <div className="w-8 h-8 rounded-lg bg-dracula-pink/10 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-dracula-pink"
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
              </div>
              <span>Blog Lucas &copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-dracula-comment">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-dracula-cyan" />
                React + TypeScript
              </span>
              <span className="hidden sm:inline text-dracula-current">
                &bull;
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-dracula-purple" />
                Tema Dracula Dark
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
