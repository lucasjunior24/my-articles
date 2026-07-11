import type { ArticleRepositoryPort } from "../../ports/ArticleRepositoryPort";
import type { AuthRepositoryPort } from "../../ports/AuthRepositoryPort";
import type { Article, CreateArticleDTO } from "../../entities/Article";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { ValidationError } from "../../errors/ValidationError";
import {
  isValidTitle,
  isValidContent,
  isValidExcerpt,
  isValidTags,
} from "../../../shared/utils/validators";

export class CreateArticleUseCase {
  private readonly articleRepo: ArticleRepositoryPort;
  private readonly authRepo: AuthRepositoryPort;

  constructor(
    articleRepo: ArticleRepositoryPort,
    authRepo: AuthRepositoryPort,
  ) {
    this.articleRepo = articleRepo;
    this.authRepo = authRepo;
  }

  async execute(data: CreateArticleDTO, userId: string): Promise<Article> {
    const isAdmin = await this.authRepo.isAdmin(userId);

    if (!isAdmin) {
      throw new UnauthorizedError("Apenas administradores podem criar artigos");
    }

    if (!data.title || !isValidTitle(data.title)) {
      throw new ValidationError(
        "O título do artigo é obrigatório e deve ter entre 3 e 200 caracteres",
      );
    }

    if (!data.content || !isValidContent(data.content)) {
      throw new ValidationError(
        "O conteúdo do artigo é obrigatório e deve ter pelo menos 10 caracteres",
      );
    }

    if (!data.excerpt || !isValidExcerpt(data.excerpt)) {
      throw new ValidationError(
        "O resumo do artigo é obrigatório e deve ter entre 10 e 500 caracteres",
      );
    }

    if (!data.tags || !isValidTags(data.tags)) {
      throw new ValidationError("O artigo deve ter pelo menos uma tag");
    }

    const user = await this.authRepo.getCurrentUser();

    if (!user) {
      throw new UnauthorizedError("Usuário não autenticado");
    }

    const articleData: CreateArticleDTO = {
      ...data,
      status: data.status ?? "draft",
    };

    return this.articleRepo.create(articleData, userId, user.displayName);
  }
}
