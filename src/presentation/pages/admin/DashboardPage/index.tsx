import { useState, useEffect, useCallback, type FC } from "react";
import { Link } from "react-router-dom";
import { useInjection } from "../../../hooks/useInjection";
import { useAuth } from "../../../hooks/useAuth";
import type { Article } from "../../../../core/entities/Article";
import { formatDate } from "../../../../shared/utils/dateFormat";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";

/**
 * DashboardPage — Página inicial do painel admin.
 *
 * Lista todos os artigos (publicados e rascunhos) com ações
 * para editar, deletar e alternar status.
 * Exibe estatísticas: total de artigos, total de likes.
 *
 * @example
 * ```tsx
 * <DashboardPage />
 * ```
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dracula-fg">Dashboard</h1>
          <p className="text-sm text-dracula-comment mt-1">
            Gerencie seus artigos
          </p>
        </div>
        <Link
          to="/admin/artigos/novo"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-dracula-pink text-dracula-bg rounded-lg hover:bg-dracula-pink/90 transition-colors"
        >
          <svg
            className="w-4 h-4"
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
          Novo Artigo
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-dracula-current/30 border border-dracula-current/50">
          <p className="text-xs text-dracula-comment uppercase tracking-wider mb-1">
            Total
          </p>
          <p className="text-2xl font-bold text-dracula-fg">{totalArticles}</p>
          <p className="text-xs text-dracula-comment">artigos</p>
        </div>
        <div className="p-4 rounded-xl bg-dracula-current/30 border border-dracula-current/50">
          <p className="text-xs text-dracula-comment uppercase tracking-wider mb-1">
            Publicados
          </p>
          <p className="text-2xl font-bold text-dracula-green">
            {publishedCount}
          </p>
          <p className="text-xs text-dracula-comment">artigos</p>
        </div>
        <div className="p-4 rounded-xl bg-dracula-current/30 border border-dracula-current/50">
          <p className="text-xs text-dracula-comment uppercase tracking-wider mb-1">
            Rascunhos
          </p>
          <p className="text-2xl font-bold text-dracula-orange">{draftCount}</p>
          <p className="text-xs text-dracula-comment">artigos</p>
        </div>
        <div className="p-4 rounded-xl bg-dracula-current/30 border border-dracula-current/50">
          <p className="text-xs text-dracula-comment uppercase tracking-wider mb-1">
            Likes
          </p>
          <p className="text-2xl font-bold text-dracula-pink">{totalLikes}</p>
          <p className="text-xs text-dracula-comment">total</p>
        </div>
      </div>

      {/* Articles Table */}
      <div className="rounded-xl bg-dracula-current/30 border border-dracula-current/50 overflow-hidden">
        <div className="p-4 border-b border-dracula-current/50">
          <h2 className="text-lg font-semibold text-dracula-fg">
            Todos os Artigos
          </h2>
        </div>

        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg
              className="w-16 h-16 text-dracula-comment/40 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
              />
            </svg>
            <h3 className="text-lg font-medium text-dracula-fg mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="text-sm text-dracula-comment max-w-md mb-6">
              Crie seu primeiro artigo para começar.
            </p>
            <Link
              to="/admin/artigos/novo"
              className="px-4 py-2 text-sm font-medium bg-dracula-pink text-dracula-bg rounded-lg hover:bg-dracula-pink/90 transition-colors"
            >
              Criar Primeiro Artigo
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dracula-current/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-dracula-comment uppercase tracking-wider">
                    Título
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-dracula-comment uppercase tracking-wider hidden md:table-cell">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-dracula-comment uppercase tracking-wider hidden lg:table-cell">
                    Data
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-dracula-comment uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dracula-current/30">
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-dracula-current/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-dracula-fg truncate max-w-[300px]">
                            {article.title}
                          </p>
                          <p className="text-xs text-dracula-comment mt-0.5">
                            {article.authorName} • {article.likeCount} likes
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
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
                      <span className="text-sm text-dracula-comment">
                        {formatDate(article.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle status */}
                        <button
                          onClick={() => handleToggleStatus(article)}
                          disabled={togglingId === article.id}
                          className="p-2 rounded-lg text-dracula-comment hover:text-dracula-cyan hover:bg-dracula-current/50 transition-colors disabled:opacity-50"
                          title={
                            article.status === "published"
                              ? "Mover para rascunho"
                              : "Publicar"
                          }
                        >
                          {togglingId === article.id ? (
                            <LoadingSpinner size="sm" />
                          ) : article.status === "published" ? (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                        </button>

                        {/* Edit */}
                        <Link
                          to={`/admin/artigos/editar/${article.id}`}
                          className="p-2 rounded-lg text-dracula-comment hover:text-dracula-cyan hover:bg-dracula-current/50 transition-colors"
                          title="Editar"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget(article)}
                          className="p-2 rounded-lg text-dracula-comment hover:text-dracula-red hover:bg-dracula-red/10 transition-colors"
                          title="Excluir"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
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
