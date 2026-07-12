import { useState, useEffect, useCallback, type FC } from "react";
import { Link } from "react-router-dom";
import { useInjection } from "../../../hooks/useInjection";
import { useAuth } from "../../../hooks/useAuth";
import type { Article } from "../../../../core/entities/Article";
import { formatDate } from "../../../../shared/utils/dateFormat";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { Icon } from "../../../components/ui/Icon";

/**
 * DashboardPage — Página inicial do painel admin.
 *
 * Lista todos os artigos (publicados e rascunhos) com ações
 * para editar, deletar e alternar status.
 * Exibe estatísticas: total de artigos, total de likes.
 */
export const DashboardPage: FC = () => {
  const { articleAdapter, deleteArticleUseCase, updateArticleUseCase } =
    useInjection();
  const { user } = useAuth();

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allArticles = await articleAdapter.getAll();
      setArticles(allArticles);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar artigos";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [articleAdapter]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async () => {
    if (!deleteTarget || !user) return;

    setIsDeleting(true);
    try {
      await deleteArticleUseCase.execute(deleteTarget.id, user.id);
      setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao deletar artigo";
      alert(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (article: Article) => {
    if (!user) return;

    setTogglingId(article.id);
    try {
      const newStatus = article.status === "published" ? "draft" : "published";
      const updated = await updateArticleUseCase.execute(
        article.id,
        { status: newStatus },
        user.id,
      );
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? updated : a)),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao alterar status";
      alert(message);
    } finally {
      setTogglingId(null);
    }
  };

  // Stats
  const totalArticles = articles.length;
  const totalLikes = articles.reduce((sum, a) => sum + a.likeCount, 0);
  const publishedCount = articles.filter(
    (a) => a.status === "published",
  ).length;
  const draftCount = articles.filter((a) => a.status === "draft").length;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12">
        <ErrorMessage message={error} onRetry={fetchArticles} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dracula-fg">Dashboard</h1>
          <p className="text-sm text-dracula-comment mt-0.5">
            Gerencie seus artigos
          </p>
        </div>
        <Link
          to="/admin/artigos/novo"
          className="inline-flex items-center gap-2 self-start px-4 py-2 text-sm font-semibold bg-dracula-pink text-dracula-bg rounded-lg hover:bg-dracula-pink/90 transition-colors shadow-sm"
        >
          <Icon name="plus" size="sm" />
          Novo Artigo
        </Link>
      </div>

      {/* Stats Cards — refinados */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            value: totalArticles,
            suffix: "artigos",
            color: "text-dracula-fg",
            icon: (
              <Icon
                name="document"
                size="sm"
                className="text-dracula-comment"
              />
            ),
          },
          {
            label: "Publicados",
            value: publishedCount,
            suffix: "artigos",
            color: "text-dracula-green",
            icon: (
              <Icon
                name="check-circle"
                size="sm"
                className="text-dracula-green"
              />
            ),
          },
          {
            label: "Rascunhos",
            value: draftCount,
            suffix: "artigos",
            color: "text-dracula-orange",
            icon: (
              <Icon name="pencil" size="sm" className="text-dracula-orange" />
            ),
          },
          {
            label: "Likes",
            value: totalLikes,
            suffix: "total",
            color: "text-dracula-pink",
            icon: <Icon name="heart" size="sm" className="text-dracula-pink" />,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl bg-dracula-current/15 border border-dracula-current/20"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-dracula-comment uppercase tracking-wider">
                {stat.label}
              </p>
              {stat.icon}
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] text-dracula-comment mt-0.5">
              {stat.suffix}
            </p>
          </div>
        ))}
      </div>

      {/* Articles Table */}
      <div className="rounded-xl bg-dracula-current/15 border border-dracula-current/20 overflow-hidden">
        <div className="px-4 py-3 border-b border-dracula-current/20">
          <h2 className="text-sm font-semibold text-dracula-fg">
            Todos os Artigos
          </h2>
        </div>

        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <Icon
              name="document"
              size="xl"
              className="text-dracula-comment/30 mb-4"
            />
            <h3 className="text-base font-semibold text-dracula-fg mb-1">
              Nenhum artigo encontrado
            </h3>
            <p className="text-sm text-dracula-comment max-w-md mb-6">
              Crie seu primeiro artigo para começar.
            </p>
            <Link
              to="/admin/artigos/novo"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-dracula-pink text-dracula-bg rounded-lg hover:bg-dracula-pink/90 transition-colors"
            >
              <Icon name="plus" size="sm" />
              Criar Primeiro Artigo
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dracula-current/20">
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-dracula-comment uppercase tracking-wider">
                    Título
                  </th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-dracula-comment uppercase tracking-wider hidden md:table-cell">
                    Status
                  </th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-dracula-comment uppercase tracking-wider hidden lg:table-cell">
                    Data
                  </th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-dracula-comment uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dracula-current/15">
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-dracula-current/10 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-dracula-fg truncate max-w-[280px]">
                          {article.title}
                        </p>
                        <p className="text-xs text-dracula-comment mt-0.5">
                          {article.authorName} &middot; {article.likeCount}{" "}
                          likes
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium ${
                          article.status === "published"
                            ? "bg-dracula-green/10 text-dracula-green"
                            : "bg-dracula-orange/10 text-dracula-orange"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            article.status === "published"
                              ? "bg-dracula-green"
                              : "bg-dracula-orange"
                          }`}
                        />
                        {article.status === "published"
                          ? "Publicado"
                          : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-dracula-comment">
                        {formatDate(new Date(article.createdAt))}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {/* Toggle status — com label contextual */}
                        <button
                          onClick={() => handleToggleStatus(article)}
                          disabled={togglingId === article.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-dracula-comment hover:text-dracula-cyan hover:bg-dracula-current/30 transition-colors disabled:opacity-50"
                          title={
                            article.status === "published"
                              ? "Mover para rascunho"
                              : "Publicar"
                          }
                        >
                          {togglingId === article.id ? (
                            <LoadingSpinner size="sm" />
                          ) : article.status === "published" ? (
                            <>
                              <Icon name="eye-slash" size="xs" />
                              <span className="hidden sm:inline">
                                Despublicar
                              </span>
                            </>
                          ) : (
                            <>
                              <Icon name="check-circle" size="xs" />
                              <span className="hidden sm:inline">Publicar</span>
                            </>
                          )}
                        </button>

                        {/* Edit — com label */}
                        <Link
                          to={`/admin/artigos/editar/${article.id}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-dracula-comment hover:text-dracula-cyan hover:bg-dracula-current/30 transition-colors"
                          title="Editar"
                        >
                          <Icon name="pencil" size="xs" />
                          <span className="hidden sm:inline">Editar</span>
                        </Link>

                        {/* Delete — com label */}
                        <button
                          onClick={() => setDeleteTarget(article)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-dracula-comment hover:text-dracula-red hover:bg-dracula-red/10 transition-colors"
                          title="Excluir"
                        >
                          <Icon name="trash" size="xs" />
                          <span className="hidden sm:inline">Excluir</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Artigo"
        message={`Tem certeza que deseja excluir o artigo "${deleteTarget?.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
