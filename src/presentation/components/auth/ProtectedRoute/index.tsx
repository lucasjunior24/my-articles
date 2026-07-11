import type { FC, ReactNode } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import {
  loadingContainer,
  errorContainer,
  errorCard,
  errorIcon,
  errorTitle,
  errorMessage,
  errorLink,
} from "./styles";

interface ProtectedRouteProps {
  children: ReactNode;
  /**
   * Se `true`, apenas usuários com role "admin" podem acessar.
   * @default false
   */
  requireAdmin?: boolean;
  /**
   * Path para redirecionar quando não autenticado.
   * @default "/login"
   */
  redirectTo?: string;
}

/**
 * ProtectedRoute — Componente de proteção de rotas.
 *
 * Verifica se o usuário está autenticado e, opcionalmente,
 * se possui role de admin. Redireciona conforme necessário.
 *
 * @example
 * ```tsx
 * // Protege rota para qualquer usuário logado
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 *
 * // Protege rota apenas para admin
 * <ProtectedRoute requireAdmin>
 *   <AdminPanel />
 * </ProtectedRoute>
 * ```
 */
export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  redirectTo = "/login",
}) => {
  const { user, isLoading, isAdmin } = useAuth();

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className={loadingContainer}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // ── Not Authenticated → Redirect to login ──
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // ── Not Admin (but admin required) → Redirect to home ──
  if (requireAdmin && !isAdmin) {
    return (
      <div className={errorContainer}>
        <div className={errorCard}>
          <svg
            className={errorIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z"
            />
          </svg>
          <h2 className={errorTitle}>Acesso Restrito</h2>
          <p className={errorMessage}>
            Você não tem permissão para acessar esta página. Apenas
            administradores podem entrar aqui.
          </p>
          <Link to="/" className={errorLink}>
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  // ── Authorized → Render children ──
  return <>{children}</>;
};
