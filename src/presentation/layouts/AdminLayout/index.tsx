import type { FC, ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserAvatar } from "../../components/auth/UserAvatar";

interface AdminLayoutProps {
  children?: ReactNode;
}

const navItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: (
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
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    ),
  },
  {
    label: "Novo Artigo",
    path: "/admin/artigos/novo",
    icon: (
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
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    ),
  },
];

/**
 * AdminLayout — Layout do painel administrativo.
 *
 * Inclui sidebar com navegação admin, header com info do admin
 * e main content area. Usa Outlet do React Router para renderizar
 * as páginas filhas.
 *
 * @example
 * ```tsx
 * <AdminLayout />
 * ```
 */
export const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-dracula-bg">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-dracula-current/20 border-r border-dracula-current/50 hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-dracula-current/50">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-lg font-bold text-dracula-pink hover:text-dracula-pink/80 transition-colors"
          >
            <svg
              className="w-6 h-6"
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
          <span className="block mt-1 text-xs text-dracula-comment uppercase tracking-wider">
            Painel Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-dracula-pink/10 text-dracula-pink"
                    : "text-dracula-comment hover:text-dracula-fg hover:bg-dracula-current/50"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to Blog */}
        <div className="p-4 border-t border-dracula-current/50">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-dracula-comment hover:text-dracula-fg hover:bg-dracula-current/50 transition-colors"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar ao Blog
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-dracula-bg/80 backdrop-blur-md border-b border-dracula-current/50">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3">
              <Link
                to="/"
                className="text-sm font-bold text-dracula-pink hover:text-dracula-pink/80 transition-colors"
              >
                Blog Lucas
              </Link>
              <span className="text-xs text-dracula-comment">Admin</span>
            </div>

            {/* Mobile nav */}
            <nav className="md:hidden flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-dracula-pink/10 text-dracula-pink"
                        : "text-dracula-comment hover:text-dracula-fg"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User info */}
            <div className="flex items-center gap-3">
              {user && (
                <>
                  <div className="hidden sm:flex items-center gap-2">
                    <UserAvatar user={user} size="sm" />
                    <span className="text-sm text-dracula-fg">
                      {user.displayName}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 text-sm font-medium text-dracula-red hover:bg-dracula-red/10 rounded-lg transition-colors"
                  >
                    Sair
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};
