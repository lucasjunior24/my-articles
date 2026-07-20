import { useState, useCallback, type FC } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserAvatar } from "../../components/auth/UserAvatar";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { RequestWriterButton } from "../../components/writer/RequestWriterButton";
import { useToast } from "../../hooks/useToast";

/**
 * ProfilePage — Página de perfil do usuário.
 *
 * Exibe informações do usuário autenticado, sua role atual,
 * e oferece a opção de solicitar acesso como writer (se reader).
 */
export const ProfilePage: FC = () => {
  const { user, isLoading, isAdmin, isWriter, logout } = useAuth();
  const toast = useToast();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Logout realizado com sucesso!");
    } catch {
      toast.error("Erro ao fazer logout. Tente novamente.");
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout, toast]);

  // Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Icon name="user" size="xl" className="text-dracula-comment/30 mb-4" />
        <h2 className="text-lg font-semibold text-dracula-fg mb-2">
          Faça login para acessar seu perfil
        </h2>
        <p className="text-sm text-dracula-comment mb-6">
          Você precisa estar logado para ver esta página.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-dracula-pink text-dracula-bg rounded-lg hover:bg-dracula-pink/90 transition-colors"
        >
          Entrar
        </Link>
      </div>
    );
  }

  // Role badge
  const roleBadge = isAdmin ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-dracula-yellow/10 text-dracula-yellow border border-dracula-yellow/20">
      <span className="w-1.5 h-1.5 rounded-full bg-dracula-yellow" />
      Admin
    </span>
  ) : isWriter ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-dracula-cyan/10 text-dracula-cyan border border-dracula-cyan/20">
      <span className="w-1.5 h-1.5 rounded-full bg-dracula-cyan" />
      Writer
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-dracula-comment/15 text-dracula-comment border border-dracula-comment/20">
      <span className="w-1.5 h-1.5 rounded-full bg-dracula-comment" />
      Reader
    </span>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header / Card de Perfil */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dracula-current/20 via-dracula-bg to-dracula-current/15 border border-dracula-current/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-dracula-pink/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-dracula-cyan/5 rounded-full blur-2xl" />

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar grande */}
            <div className="shrink-0">
              <UserAvatar user={user} size="lg" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h1 className="text-xl font-bold text-dracula-fg">
                  {user.displayName}
                </h1>
                {roleBadge}
              </div>
              <p className="text-sm text-dracula-comment">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Informações da Conta */}
      <div className="rounded-2xl bg-dracula-current/10 border border-dracula-current/20 p-6 space-y-4">
        <h2 className="text-base font-semibold text-dracula-fg flex items-center gap-2">
          <Icon name="user" size="sm" className="text-dracula-cyan" />
          Informações da Conta
        </h2>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-dracula-current/10">
            <span className="text-sm text-dracula-comment">UID</span>
            <span className="text-sm font-mono text-dracula-fg/60 truncate max-w-[320px]">
              {user.id}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-dracula-current/10">
            <span className="text-sm text-dracula-comment">Role</span>
            <span className="text-sm font-medium text-dracula-fg">
              {isAdmin ? "Administrador" : isWriter ? "Escritor" : "Leitor"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-dracula-current/10">
            <span className="text-sm text-dracula-comment">Permissões</span>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-dracula-cyan/10 text-dracula-cyan">
                {isWriter ? "✅ Painel Admin" : "❌ Painel Admin"}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-dracula-green/10 text-dracula-green">
                {isWriter ? "✅ Criar artigos" : "❌ Criar artigos"}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-dracula-purple/10 text-dracula-purple">
                {isAdmin ? "✅ Gerenciar users" : "❌ Gerenciar users"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Solicitação de Writer (apenas readers) */}
      {!isWriter && !isAdmin && (
        <div className="animate-fade-in-up">
          <RequestWriterButton />
        </div>
      )}

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        {isWriter && (
          <Link
            to="/admin"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-dracula-cyan/10 text-dracula-cyan border border-dracula-cyan/20 hover:bg-dracula-cyan/20 transition-colors"
          >
            <Icon name="chart-bar" size="sm" />
            Acessar Painel de Artigos
          </Link>
        )}
        <Button
          variant="ghost"
          onClick={handleLogout}
          isLoading={isLoggingOut}
          className="text-dracula-red hover:bg-dracula-red/10 sm:ml-auto"
        >
          <Icon name="logout" size="sm" />
          Sair da conta
        </Button>
      </div>
    </div>
  );
};
