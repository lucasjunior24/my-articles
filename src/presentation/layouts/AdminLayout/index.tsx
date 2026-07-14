import type { FC, ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserAvatar } from "../../components/auth/UserAvatar";
import { Icon } from "../../components/ui/Icon";

interface AdminLayoutProps {
  children?: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: <Icon name="chart-bar" size="sm" />,
  },
  {
    label: "Novo Artigo",
    path: "/admin/artigos/novo",
    icon: <Icon name="plus" size="sm" />,
  },
];

/**
 * AdminLayout — Layout do painel administrativo.
 *
 * Inclui sidebar com navegação admin, header com info do admin
 * e main content area. Usa Outlet do React Router para renderizar
 * as páginas filhas.
 *
 * Itens exclusivos para admin (ex: Solicitações) são adicionados
 * dinamicamente ao nav via `visibleNavItems`.
 */
export const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const adminOnlyItems: NavItem[] = [
    {
      label: "Solicitações",
      path: "/admin/solicitacoes-writer",
      icon: <Icon name="user" size="sm" />,
    },
  ];

  const visibleNavItems: NavItem[] = isAdmin
    ? [...navItems, ...adminOnlyItems]
    : navItems;

  return (
    <div className="min-h-screen flex bg-dracula-bg">
      {/* Sidebar — fixa, mais compacta */}
      <aside className="w-56 shrink-0 bg-dracula-current/10 border-r border-dracula-current/20 hidden md:flex flex-col">
        {/* Logo / Brand */}
        <div className="px-5 py-4 border-b border-dracula-current/20">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-base font-bold text-dracula-pink hover:text-dracula-pink/80 transition-colors"
          >
            <Icon name="book" size="sm" />
            <span>My Articles</span>
          </Link>
          <span className="block mt-0.5 text-[10px] font-semibold text-dracula-comment uppercase tracking-widest">
            Painel
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-dracula-pink/10 text-dracula-pink"
                    : "text-dracula-comment hover:text-dracula-fg hover:bg-dracula-current/30"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer sidebar actions */}
        <div className="px-3 py-3 border-t border-dracula-current/20 space-y-0.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-dracula-comment hover:text-dracula-cyan hover:bg-dracula-current/30 transition-colors"
          >
            <Icon name="arrow-left" size="sm" />
            Voltar ao Blog
          </Link>
          {user && (
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-dracula-red/80 hover:text-dracula-red hover:bg-dracula-red/10 transition-colors"
            >
              <Icon name="logout" size="sm" />
              Sair
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header — mobile-first */}
        <header className="sticky top-0 z-40 bg-dracula-bg/85 backdrop-blur-md border-b border-dracula-current/20">
          <div className="flex items-center justify-between h-14 px-4 sm:px-6">
            {/* Mobile: logo + badge */}
            <div className="md:hidden flex items-center gap-2">
              <Link
                to="/"
                className="text-sm font-bold text-dracula-pink hover:text-dracula-pink/80 transition-colors"
              >
                My Articles
              </Link>
              <span className="text-[10px] font-semibold text-dracula-comment uppercase tracking-wider bg-dracula-current/30 px-1.5 py-0.5 rounded">
                Painel
              </span>
            </div>

            {/* Mobile navigation pills */}
            <nav className="md:hidden flex items-center gap-1">
              {visibleNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-dracula-pink/10 text-dracula-pink"
                        : "text-dracula-comment hover:text-dracula-fg"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User info + logout (desktop right side) */}
            <div className="flex items-center gap-3">
              {user && (
                <>
                  <div className="hidden sm:flex items-center gap-2">
                    <UserAvatar user={user} size="sm" />
                    <span className="text-sm text-dracula-fg/70 font-medium">
                      {user.displayName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="sm:hidden px-2.5 py-1.5 text-xs font-medium text-dracula-red hover:bg-dracula-red/10 rounded-lg transition-colors"
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
