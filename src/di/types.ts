import type { FirebaseArticleAdapter } from "../adapters/firebase/FirebaseArticleAdapter";
import type { FirebaseAuthAdapter } from "../adapters/firebase/FirebaseAuthAdapter";
import type { FirebaseLikeAdapter } from "../adapters/firebase/FirebaseLikeAdapter";
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
}
