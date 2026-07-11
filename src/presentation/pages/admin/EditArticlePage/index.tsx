import { useState, useEffect, useCallback, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInjection } from "../../../hooks/useInjection";
import { useAuth } from "../../../hooks/useAuth";
import { ArticleForm } from "../../../components/article/ArticleForm";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import type {
  Article,
  UpdateArticleDTO,
} from "../../../../core/entities/Article";

/**
 * EditArticlePage — Página de edição de artigo existente.
 *
 * Carrega os dados do artigo pelo ID e renderiza o ArticleForm
 * no modo "edit" com os dados preenchidos.
 *
 * @example
 * ```tsx
 * <EditArticlePage />
 * ```
 */
export const EditArticlePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { articleAdapter, updateArticleUseCase } = useInjection();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchArticle = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await articleAdapter.getById(id);
      if (!result) {
        setError("Artigo não encontrado");
        return;
      }
      setArticle(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar artigo";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [id, articleAdapter]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const handleSubmit = async (data: UpdateArticleDTO) => {
    if (!user || !id) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await updateArticleUseCase.execute(id, data, user.id);
      navigate("/admin");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar artigo";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <ErrorMessage message={error} onRetry={fetchArticle} />
      </div>
    );
  }

  // Not found
  if (!article) {
    return (
      <div className="py-12">
        <ErrorMessage message="Artigo não encontrado" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dracula-fg">Editar Artigo</h1>
        <p className="text-sm text-dracula-comment mt-1">
          Editando: {article.title}
        </p>
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="p-4 rounded-lg bg-dracula-red/10 border border-dracula-red/30">
          <p className="text-sm text-dracula-red">{submitError}</p>
        </div>
      )}

      {/* Form */}
      <div className="p-6 rounded-xl bg-dracula-current/30 border border-dracula-current/50">
        <ArticleForm
          mode="edit"
          initialData={{
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            tags: article.tags,
            coverImage: article.coverImage ?? "",
            status: article.status,
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};
