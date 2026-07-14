import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDI } from "../../../hooks/useDI";
import { Button } from "../../../components/ui/Button";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { formatDate } from "../../../../shared/utils/dateFormat";
import type { WriterRequest } from "../../../../core/entities/WriterRequest";

/**
 * Página de gerenciamento de solicitações de Writer.
 * Apenas acessível por admin.
 */
export function WriterRequestsPage() {
  const { user } = useAuth();
  const container = useDI();
  const [requests, setRequests] = useState<WriterRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "pending" | "approved" | "rejected" | "all"
  >("all");

  const loadRequests = useCallback(
    async (filterValue: "pending" | "approved" | "rejected" | "all") => {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        const result = await container.getWriterRequestsUseCase.execute(
          user.id,
          filterValue === "all" ? undefined : filterValue,
        );
        setRequests(result);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao carregar solicitações";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [container, user],
  );

  useEffect(() => {
    loadRequests(filter); // eslint-disable-line react-hooks/set-state-in-effect
  }, [filter, loadRequests]);

  const handleFilterChange = (
    f: "pending" | "approved" | "rejected" | "all",
  ) => {
    setFilter(f);
    loadRequests(f);
  };

  const handleRetry = () => {
    loadRequests(filter);
  };

  const handleAction = async (
    requestId: string,
    status: "approved" | "rejected",
  ) => {
    if (!user) return;
    setActionLoading(requestId);
    try {
      await container.approveWriterUseCase.execute(
        requestId,
        status,
        user.id,
        user.displayName,
      );
      await loadRequests(filter);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao processar solicitação";
      setError(message);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dracula-fg">
            Solicitações de Writer
          </h1>
          <p className="text-dracula-comment mt-1">
            Gerencie os pedidos de usuários que desejam se tornar escritores
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-dracula-pink/20 text-dracula-pink border border-dracula-pink/30">
            {pendingCount} pendente{pendingCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => handleFilterChange(f)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              filter === f
                ? "bg-dracula-pink/20 text-dracula-pink border-dracula-pink/50"
                : "text-dracula-comment border-dracula-current hover:text-dracula-fg hover:border-dracula-comment"
            }`}
          >
            {f === "all"
              ? "Todos"
              : f === "pending"
                ? "Pendentes"
                : f === "approved"
                  ? "Aprovados"
                  : "Rejeitados"}
          </button>
        ))}
      </div>

      {/* Estados */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={handleRetry} />}

      {!isLoading && !error && requests.length === 0 && (
        <div className="text-center py-12 text-dracula-comment">
          <p className="text-lg">Nenhuma solicitação encontrada</p>
          <p className="text-sm mt-1">
            {filter !== "all"
              ? "Tente mudar o filtro para ver outras solicitações"
              : "Quando um leitor solicitar para ser escritor, aparecerá aqui"}
          </p>
        </div>
      )}

      {/* Tabela de solicitações */}
      {!isLoading && !error && requests.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-dracula-current">
          <table className="w-full text-sm">
            <thead className="bg-dracula-current/50">
              <tr>
                <th className="text-left px-4 py-3 text-dracula-comment font-medium">
                  Usuário
                </th>
                <th className="text-left px-4 py-3 text-dracula-comment font-medium hidden sm:table-cell">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-dracula-comment font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-dracula-comment font-medium hidden md:table-cell">
                  Solicitado em
                </th>
                <th className="text-right px-4 py-3 text-dracula-comment font-medium">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dracula-current">
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-dracula-current/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-dracula-fg font-medium">
                      {req.userDisplayName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dracula-comment hidden sm:table-cell">
                    {req.userEmail}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === "pending"
                          ? "bg-dracula-orange/20 text-dracula-orange border border-dracula-orange/30"
                          : req.status === "approved"
                            ? "bg-dracula-green/20 text-dracula-green border border-dracula-green/30"
                            : "bg-dracula-red/20 text-dracula-red border border-dracula-red/30"
                      }`}
                    >
                      {req.status === "pending"
                        ? "Pendente"
                        : req.status === "approved"
                          ? "Aprovado"
                          : "Rejeitado"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dracula-comment hidden md:table-cell">
                    {formatDate(req.requestedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {req.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAction(req.id, "approved")}
                          isLoading={actionLoading === req.id}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleAction(req.id, "rejected")}
                          isLoading={actionLoading === req.id}
                        >
                          Rejeitar
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-dracula-comment">
                        {req.reviewedBy && `por ${req.reviewedBy}`}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
