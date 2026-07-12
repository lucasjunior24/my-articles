import { useAuth } from "../../../hooks/useAuth";
import { useWriterRequest } from "../../../hooks/useWriterRequest";
import { Button } from "../../ui/Button";
import { LoadingSpinner } from "../../ui/LoadingSpinner";

interface RequestWriterButtonProps {
  className?: string;
}

/**
 * Botão que permite ao reader solicitar para se tornar writer.
 *
 * Estados:
 * - Não logado: não renderiza nada
 * - Admin/Writer: não renderiza nada
 * - Reader sem solicitação: mostra botão "Quero Escrever"
 * - Reader com solicitação pendente: mostra "Solicitação Pendente"
 * - Reader com solicitação aprovada: não renderiza (deveria ser writer)
 * - Reader com solicitação rejeitada: mostra "Solicitação Rejeitada" + "Tentar Novamente"
 */
export function RequestWriterButton({
  className = "",
}: RequestWriterButtonProps) {
  const { user, isAdmin, isWriter } = useAuth();
  const { request, isLoading, isSubmitting, error, requestWriter } =
    useWriterRequest();

  // Não renderiza se não estiver logado
  if (!user) return null;

  // Não renderiza se já for admin ou writer
  if (isAdmin || isWriter) return null;

  if (isLoading) {
    return (
      <div className={className}>
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (request?.status === "pending") {
    return (
      <span
        className={`text-sm px-3 py-1.5 rounded-full bg-dracula-orange/20 text-dracula-orange border border-dracula-orange/30 ${className}`}
      >
        Solicitação Pendente
      </span>
    );
  }

  if (request?.status === "rejected") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm px-3 py-1.5 rounded-full bg-dracula-red/20 text-dracula-red border border-dracula-red/30">
          Solicitação Rejeitada
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={requestWriter}
          isLoading={isSubmitting}
        >
          Tentar Novamente
        </Button>
      </div>
    );
  }

  // Sem solicitação → mostra botão para solicitar
  return (
    <div className={className}>
      <Button
        variant="primary"
        size="sm"
        onClick={requestWriter}
        isLoading={isSubmitting}
      >
        Quero Escrever
      </Button>
      {error && <p className="text-xs text-dracula-red mt-1">{error}</p>}
    </div>
  );
}
