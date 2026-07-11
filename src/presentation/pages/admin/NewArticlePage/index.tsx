import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useInjection } from "../../../hooks/useInjection";
import { useAuth } from "../../../hooks/useAuth";
import { ArticleForm } from "../../../components/article/ArticleForm";
import type {
  CreateArticleDTO,
  UpdateArticleDTO,
} from "../../../../core/entities/Article";

/**
 * NewArticlePage — Página de criação de novo artigo.
 *
 * Renderiza o ArticleForm no modo "create" e redireciona
 * para o dashboard após sucesso.
 *
 * @example
 * ```tsx
 * <NewArticlePage />
 * ```
 */
export const NewArticlePage: FC = () => {
  const { createArticleUseCase } = useInjection();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateArticleDTO | UpdateArticleDTO) => {
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await createArticleUseCase.execute(data as CreateArticleDTO, user.id);
      navigate("/admin");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar artigo";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dracula-fg">Novo Artigo</h1>
        <p className="text-sm text-dracula-comment mt-1">
          Crie um novo artigo para o blog
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg bg-dracula-red/10 border border-dracula-red/30">
          <p className="text-sm text-dracula-red">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="p-6 rounded-xl bg-dracula-current/30 border border-dracula-current/50">
        <ArticleForm
          mode="create"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};
