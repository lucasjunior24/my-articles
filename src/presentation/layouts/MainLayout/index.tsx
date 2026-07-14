import type { FC, ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AuthButton } from "../../components/auth/AuthButton";
import { Icon } from "../../components/ui/Icon";

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
    `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? "bg-dracula-pink/15 text-dracula-pink shadow-sm"
        : "text-dracula-comment hover:text-dracula-fg hover:bg-dracula-current/40"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-dracula-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dracula-bg/85 backdrop-blur-lg border-b border-dracula-current/20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo — compacto */}
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-bold text-dracula-pink hover:text-dracula-pink/80 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-dracula-pink/12 flex items-center justify-center group-hover:bg-dracula-pink/20 transition-colors">
                <Icon name="book" size="sm" />
              </div>
              <span className="hidden sm:inline">My Articles</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/" className={navLinkClass("/")}>
                <Icon name="home" size="sm" />
                <span>Home</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className={navLinkClass("/admin")}>
                  <Icon name="shield-check" size="sm" />
                  <span>Painel</span>
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
          {children ?? <Outlet />}
        </div>
      </main>

      {/* Footer — mais enxuto */}
      <footer className="border-t border-dracula-current/20 bg-dracula-bg/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-dracula-comment text-sm">
              <div className="w-6 h-6 rounded-md bg-dracula-pink/10 flex items-center justify-center">
                <Icon name="book" size="xs" className="text-dracula-pink" />
              </div>
              <span>My Articles &copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-dracula-comment/70">
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-dracula-cyan" />
                React + TypeScript
              </span>
              <span className="hidden sm:inline text-dracula-current/30">
                &bull;
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-dracula-purple" />
                Tema Dracula
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
