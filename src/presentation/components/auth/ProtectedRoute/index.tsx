import type { FC, ReactNode } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { Icon } from "../../ui/Icon";
import {
  loadingContainer,
  errorContainer,
  errorCard,
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
          <Icon
            name="exclamation-circle"
            size="xl"
            className="text-dracula-red mx-auto mb-4 w-12 h-12"
          />
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
