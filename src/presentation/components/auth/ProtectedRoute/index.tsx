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
   * Se `true`, usuários com role "admin" ou "writer" podem acessar.
   * Tem precedência menor que `requireAdmin`.
   * @default false
   */
  requireWriter?: boolean;
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
 * se possui a role necessária. Redireciona conforme necessário.
 *
 * Precedência de verificação: requireAdmin > requireWriter > autenticado
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
 *
 * // Protege rota para admin e writer
 * <ProtectedRoute requireWriter>
 *   <WriterPanel />
 * </ProtectedRoute>
 * ```
 */
export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  requireWriter = false,
  redirectTo = "/login",
}) => {
  const { user, isLoading, isAdmin, isWriter } = useAuth();

  console.log("ProtectedRoute: user", user);
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

  // ── Admin required → only admin ──
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

  // ── Writer required → admin or writer ──
  if (requireWriter && !isWriter) {
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
            administradores e escritores podem entrar aqui.
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
