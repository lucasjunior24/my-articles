import { useState, useCallback, type FC, type FormEvent } from "react";
import type {
  CreateArticleDTO,
  UpdateArticleDTO,
} from "../../../../core/entities/Article";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { TextArea } from "../../ui/TextArea";
import { MarkdownRenderer } from "../MarkdownRenderer";

interface ArticleFormProps {
  initialData?: {
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    coverImage: string;
    status: "draft" | "published";
  };
  onSubmit: (data: CreateArticleDTO | UpdateArticleDTO) => Promise<void>;
  isSubmitting: boolean;
  mode: "create" | "edit";
}

interface FormErrors {
  title?: string;
  content?: string;
  excerpt?: string;
  tags?: string;
}

/**
 * ArticleForm — Formulário de criação/edição de artigos.
 *
 * Campos: título, conteúdo (Markdown), excerpt, tags, coverImage, status.
 * Inclui preview de Markdown ao vivo e validação de campos.
 *
 * @example
 * ```tsx
 * <ArticleForm
 *   mode="create"
 *   onSubmit={handleCreate}
 *   isSubmitting={isLoading}
 * />
 * ```
 */
export const ArticleForm: FC<ArticleFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  mode,
}) => {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") ?? "",
  );
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    initialData?.status ?? "draft",
  );
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const parseTags = (input: string): string[] => {
    return input
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  };

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim() || title.trim().length < 3) {
      newErrors.title = "O título deve ter pelo menos 3 caracteres";
    }
    if (title.trim().length > 200) {
      newErrors.title = "O título deve ter no máximo 200 caracteres";
    }

    if (!content.trim() || content.trim().length < 10) {
      newErrors.content = "O conteúdo deve ter pelo menos 10 caracteres";
    }

    if (!excerpt.trim() || excerpt.trim().length < 10) {
      newErrors.excerpt = "O resumo deve ter pelo menos 10 caracteres";
    }
    if (excerpt.trim().length > 500) {
      newErrors.excerpt = "O resumo deve ter no máximo 500 caracteres";
    }

    const tags = parseTags(tagsInput);
    if (tags.length === 0) {
      newErrors.tags = "Adicione pelo menos uma tag";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, content, excerpt, tagsInput]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const tags = parseTags(tagsInput);

    const data: CreateArticleDTO = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim(),
      tags,
      ...(coverImage.trim() ? { coverImage: coverImage.trim() } : {}),
      status,
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Input
        label="Título do Artigo"
        placeholder="Digite o título do artigo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        maxLength={200}
      />

      {/* Content / Preview */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-dracula-fg">
            Conteúdo (Markdown)
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs font-medium text-dracula-cyan hover:text-dracula-pink transition-colors"
          >
            {showPreview ? "Editar" : "Preview"}
          </button>
        </div>

        {showPreview ? (
          <div className="min-h-[300px] p-4 rounded-lg bg-dracula-current/30 border border-dracula-current overflow-auto">
            {content.trim() ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p className="text-dracula-comment text-sm italic">
                Nenhum conteúdo para preview...
              </p>
            )}
          </div>
        ) : (
          <TextArea
            placeholder="Digite o conteúdo do artigo em Markdown..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            error={errors.content}
          />
        )}
      </div>

      {/* Excerpt */}
      <TextArea
        label="Resumo (Excerpt)"
        placeholder="Um breve resumo do artigo"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        rows={3}
        error={errors.excerpt}
        maxLength={500}
      />

      {/* Tags */}
      <Input
        label="Tags (separadas por vírgula)"
        placeholder="React, TypeScript, Firebase"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        error={errors.tags}
      />

      {/* Cover Image */}
      <Input
        label="URL da Imagem de Capa (opcional)"
        placeholder="https://exemplo.com/imagem.jpg"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
      />

      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-dracula-fg">Status</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="draft"
              checked={status === "draft"}
              onChange={() => setStatus("draft")}
              className="w-4 h-4 text-dracula-orange bg-dracula-current border-dracula-current focus:ring-dracula-orange"
            />
            <span className="text-sm text-dracula-fg">Rascunho</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="published"
              checked={status === "published"}
              onChange={() => setStatus("published")}
              className="w-4 h-4 text-dracula-green bg-dracula-current border-dracula-current focus:ring-dracula-green"
            />
            <span className="text-sm text-dracula-fg">Publicado</span>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-dracula-current/50">
        <Button
          type="button"
          variant="ghost"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {mode === "create" ? "Criar Artigo" : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
};
