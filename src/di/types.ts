import type { FirebaseArticleAdapter } from "../adapters/firebase/FirebaseArticleAdapter";
import type { FirebaseAuthAdapter } from "../adapters/firebase/FirebaseAuthAdapter";
import type { FirebaseLikeAdapter } from "../adapters/firebase/FirebaseLikeAdapter";
import type { FirebaseWriterRequestAdapter } from "../adapters/firebase/FirebaseWriterRequestAdapter";
import type { IPCacheAdapter } from "../adapters/cache/IPCacheAdapter";
import type { CreateArticleUseCase } from "../core/use-cases/articles/CreateArticleUseCase";
import type { GetArticlesUseCase } from "../core/use-cases/articles/GetArticlesUseCase";
import type { GetArticleBySlugUseCase } from "../core/use-cases/articles/GetArticleBySlugUseCase";
import type { UpdateArticleUseCase } from "../core/use-cases/articles/UpdateArticleUseCase";
import type { DeleteArticleUseCase } from "../core/use-cases/articles/DeleteArticleUseCase";
import type { LoginUseCase } from "../core/use-cases/auth/LoginUseCase";
import type { LogoutUseCase } from "../core/use-cases/auth/LogoutUseCase";
import type { GetCurrentUserUseCase } from "../core/use-cases/auth/GetCurrentUserUseCase";
import type { ToggleLikeUseCase } from "../core/use-cases/likes/ToggleLikeUseCase";
import type { GetArticleLikesUseCase } from "../core/use-cases/likes/GetArticleLikesUseCase";
import type { RequestWriterUseCase } from "../core/use-cases/writer/RequestWriterUseCase";
import type { ApproveWriterUseCase } from "../core/use-cases/writer/ApproveWriterUseCase";
import type { GetWriterRequestsUseCase } from "../core/use-cases/writer/GetWriterRequestsUseCase";

/**
 * Container interface representing the shape of the DI container.
 * This type is derived from the `typeof container` pattern,
 * providing full type safety when accessing dependencies.
 */
export interface Container {
  // Adapters (singletons)
  articleAdapter: FirebaseArticleAdapter;
  authAdapter: FirebaseAuthAdapter;
  likeAdapter: FirebaseLikeAdapter;
  cacheAdapter: IPCacheAdapter;
  writerRequestAdapter: FirebaseWriterRequestAdapter;

  // Use Cases — Articles
  createArticleUseCase: CreateArticleUseCase;
  getArticlesUseCase: GetArticlesUseCase;
  getArticleBySlugUseCase: GetArticleBySlugUseCase;
  updateArticleUseCase: UpdateArticleUseCase;
  deleteArticleUseCase: DeleteArticleUseCase;

  // Use Cases — Auth
  loginUseCase: LoginUseCase;
  logoutUseCase: LogoutUseCase;
  getCurrentUserUseCase: GetCurrentUserUseCase;

  // Use Cases — Likes
  toggleLikeUseCase: ToggleLikeUseCase;
  getArticleLikesUseCase: GetArticleLikesUseCase;

  // Use Cases — Writer Requests
  requestWriterUseCase: RequestWriterUseCase;
  approveWriterUseCase: ApproveWriterUseCase;
  getWriterRequestsUseCase: GetWriterRequestsUseCase;
}
