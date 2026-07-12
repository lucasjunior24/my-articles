import { FirebaseArticleAdapter } from "../adapters/firebase/FirebaseArticleAdapter";
import { FirebaseAuthAdapter } from "../adapters/firebase/FirebaseAuthAdapter";
import { FirebaseLikeAdapter } from "../adapters/firebase/FirebaseLikeAdapter";
import { FirebaseWriterRequestAdapter } from "../adapters/firebase/FirebaseWriterRequestAdapter";
import { IPCacheAdapter } from "../adapters/cache/IPCacheAdapter";
import { getIPHash } from "../adapters/http/IPFetcher";

import { CreateArticleUseCase } from "../core/use-cases/articles/CreateArticleUseCase";
import { GetArticlesUseCase } from "../core/use-cases/articles/GetArticlesUseCase";
import { GetArticleBySlugUseCase } from "../core/use-cases/articles/GetArticleBySlugUseCase";
import { UpdateArticleUseCase } from "../core/use-cases/articles/UpdateArticleUseCase";
import { DeleteArticleUseCase } from "../core/use-cases/articles/DeleteArticleUseCase";

import { LoginUseCase } from "../core/use-cases/auth/LoginUseCase";
import { LogoutUseCase } from "../core/use-cases/auth/LogoutUseCase";
import { GetCurrentUserUseCase } from "../core/use-cases/auth/GetCurrentUserUseCase";

import { ToggleLikeUseCase } from "../core/use-cases/likes/ToggleLikeUseCase";
import { GetArticleLikesUseCase } from "../core/use-cases/likes/GetArticleLikesUseCase";

import { RequestWriterUseCase } from "../core/use-cases/writer/RequestWriterUseCase";
import { ApproveWriterUseCase } from "../core/use-cases/writer/ApproveWriterUseCase";
import { GetWriterRequestsUseCase } from "../core/use-cases/writer/GetWriterRequestsUseCase";

import type { Container } from "./types";

/**
 * Creates and returns the application's dependency injection container.
 *
 * The container instantiates all adapters as singletons and wires them
 * into the use cases. The IP hash is resolved asynchronously and used
 * to create the cache adapter.
 *
 * Usage:
 * ```ts
 * const container = await createContainer();
 * const articles = await container.getArticlesUseCase.execute(ipHash);
 * ```
 */
export async function createContainer(): Promise<Container> {
  // ── Resolve IP hash for cache isolation ──
  const ipHash = await getIPHash();

  // ── Adapters (singletons) ──
  const articleAdapter = new FirebaseArticleAdapter();
  const authAdapter = new FirebaseAuthAdapter();
  const likeAdapter = new FirebaseLikeAdapter();
  const cacheAdapter = new IPCacheAdapter(ipHash);
  const writerRequestAdapter = new FirebaseWriterRequestAdapter();

  // ── Use Cases — Articles ──
  const createArticleUseCase = new CreateArticleUseCase(
    articleAdapter,
    authAdapter,
  );

  const getArticlesUseCase = new GetArticlesUseCase(
    articleAdapter,
    cacheAdapter,
  );

  const getArticleBySlugUseCase = new GetArticleBySlugUseCase(
    articleAdapter,
    cacheAdapter,
  );

  const updateArticleUseCase = new UpdateArticleUseCase(
    articleAdapter,
    authAdapter,
    cacheAdapter,
  );

  const deleteArticleUseCase = new DeleteArticleUseCase(
    articleAdapter,
    authAdapter,
    cacheAdapter,
  );

  // ── Use Cases — Auth ──
  const loginUseCase = new LoginUseCase(authAdapter);
  const logoutUseCase = new LogoutUseCase(authAdapter);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(authAdapter);

  // ── Use Cases — Likes ──
  const toggleLikeUseCase = new ToggleLikeUseCase(likeAdapter, authAdapter);
  const getArticleLikesUseCase = new GetArticleLikesUseCase(likeAdapter);

  // ── Use Cases — Writer Requests ──
  const requestWriterUseCase = new RequestWriterUseCase(
    authAdapter,
    writerRequestAdapter,
  );
  const approveWriterUseCase = new ApproveWriterUseCase(
    authAdapter,
    writerRequestAdapter,
  );
  const getWriterRequestsUseCase = new GetWriterRequestsUseCase(
    authAdapter,
    writerRequestAdapter,
  );

  return {
    // Adapters
    articleAdapter,
    authAdapter,
    likeAdapter,
    cacheAdapter,
    writerRequestAdapter,

    // Use Cases — Articles
    createArticleUseCase,
    getArticlesUseCase,
    getArticleBySlugUseCase,
    updateArticleUseCase,
    deleteArticleUseCase,

    // Use Cases — Auth
    loginUseCase,
    logoutUseCase,
    getCurrentUserUseCase,

    // Use Cases — Likes
    toggleLikeUseCase,
    getArticleLikesUseCase,

    // Use Cases — Writer Requests
    requestWriterUseCase,
    approveWriterUseCase,
    getWriterRequestsUseCase,
  };
}
