# 🏗️ Blog Lucas — Arquitetura do Sistema

> **Tema:** Dracula Dark (azul escuro profundo)  
> **Inspiração:** Dracula Theme + Twitter Dark Mode

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Estrutura de Diretórios](#3-estrutura-de-diretórios)
4. [Camada Core — Regras de Negócio](#4-camada-core--regras-de-negócio)
5. [Camada de Adaptadores — Bibliotecas Externas](#5-camada-de-adaptadores--bibliotecas-externas)
6. [Injeção de Dependência](#6-injeção-de-dependência)
7. [Camada de Apresentação — Componentes React](#7-camada-de-apresentação--componentes-react)
8. [Sistema de Cache por IP](#8-sistema-de-cache-por-ip)
9. [Autenticação e Autorização](#9-autenticação-e-autorização)
10. [Sistema de Like/Dislike](#10-sistema-de-likedislike)
11. [Rotas e Navegação](#11-rotas-e-navegação)
12. [Estilo com Tailwind CSS](#12-estilo-com-tailwind-css)
13. [Fluxo de Dados Completo](#13-fluxo-de-dados-completo)
14. [Firebase Security Rules](#14-firebase-security-rules)
15. [Tratamento de Erros](#15-tratamento-de-erros)
16. [Testes](#16-testes)

---

## 1. Visão Geral

Sistema de blog onde:

- **Qualquer pessoa** pode ler artigos (com cache por IP para performance)
- **Usuários logados** podem avaliar artigos com like/dislike
- **Apenas administradores** podem criar, editar e publicar artigos
- Login via Google OAuth (Firebase Authentication)
- Dados persistidos no Firebase Firestore

### Princípios Arquiteturais

| Princípio | Descrição |
|---|---|
| **Separação de Responsabilidades** | Core (regras de negócio) ≠ Adapters (libs) ≠ Presentation (UI) |
| **Strong Typing** | TypeScript strict mode, proibido `any`, uso de `unknown` com type guards |
| **Dependency Inversion** | Core define interfaces (ports), adapters implementam |
| **Composição sobre Herança** | Componentes pequenos compostos, não hierarquias profundas |
| **DRY** | Máximo reaproveitamento de componentes e lógica |
| **Separação Lógica × Estilo** | Lógica no componente, classes Tailwind em arquivo separado |

---

## 2. Stack Tecnológica

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **React** | 18+ | Biblioteca de UI |
| **TypeScript** | 5+ | Tipagem estática (strict mode) |
| **Vite** | 5+ | Bundler e dev server |
| **Firebase** | 10+ | Auth + Firestore + Storage |
| **Tailwind CSS** | 3+ | Estilização utilitária |
| **React Router** | 6+ | Roteamento SPA |
| **React Markdown** | 9+ | Renderização de artigos em Markdown |
| **uuid** | 9+ | Geração de IDs únicos |

---

## 3. Estrutura de Diretórios

```
src/
├── core/                          # 🧠 REGRAS DE NEGÓCIO (zero dependência externa)
│   ├── entities/                  # Entidades de domínio
│   │   ├── Article.ts
│   │   ├── User.ts
│   │   ├── LikeDislike.ts
│   │   └── CacheEntry.ts
│   │
│   ├── ports/                     # Interfaces (contratos) que o core espera
│   │   ├── ArticleRepositoryPort.ts
│   │   ├── AuthRepositoryPort.ts
│   │   ├── LikeRepositoryPort.ts
│   │   └── CachePort.ts
│   │
│   ├── use-cases/                 # Casos de uso da aplicação
│   │   ├── articles/
│   │   │   ├── CreateArticleUseCase.ts
│   │   │   ├── GetArticlesUseCase.ts
│   │   │   ├── GetArticleBySlugUseCase.ts
│   │   │   ├── UpdateArticleUseCase.ts
│   │   │   └── DeleteArticleUseCase.ts
│   │   ├── auth/
│   │   │   ├── LoginUseCase.ts
│   │   │   ├── LogoutUseCase.ts
│   │   │   └── GetCurrentUserUseCase.ts
│   │   └── likes/
│   │       ├── ToggleLikeUseCase.ts
│   │       └── GetArticleLikesUseCase.ts
│   │
│   └── errors/                    # Erros de domínio
│       ├── DomainError.ts
│       ├── UnauthorizedError.ts
│       └── ValidationError.ts
│
├── adapters/                      # 🔌 IMPLEMENTAÇÕES DAS INTERFACES
│   ├── firebase/
│   │   ├── FirebaseArticleAdapter.ts
│   │   ├── FirebaseAuthAdapter.ts
│   │   ├── FirebaseLikeAdapter.ts
│   │   └── firebaseConfig.ts      # Config centralizada do Firebase
│   │
│   ├── cache/
│   │   └── IPCacheAdapter.ts      # Cache por IP (localStorage)
│   │
│   └── http/
│       └── IPFetcher.ts           # Obtém IP público do usuário
│
├── di/                            # 💉 INJEÇÃO DE DEPENDÊNCIA
│   ├── container.ts               # Container DI
│   └── types.ts                   # Tipos do container
│
├── presentation/                  # 🎨 CAMADA DE APRESENTAÇÃO (React)
│   ├── components/                # Componentes reutilizáveis
│   │   ├── ui/                    # Componentes genéricos de UI
│   │   │   ├── Button/
│   │   │   │   ├── index.tsx      # Lógica + JSX
│   │   │   │   └── styles.ts      # Classes Tailwind
│   │   │   ├── Input/
│   │   │   │   ├── index.tsx
│   │   │   │   └── styles.ts
│   │   │   ├── LoadingSpinner/
│   │   │   │   ├── index.tsx
│   │   │   │   └── styles.ts
│   │   │   ├── ErrorMessage/
│   │   │   │   ├── index.tsx
│   │   │   │   └── styles.ts
│   │   │   └── CacheIndicator/
│   │   │       ├── index.tsx
│   │   │       └── styles.ts
│   │   │
│   │   ├── article/               # Componentes de artigo
│   │   │   ├── ArticleCard/
│   │   │   │   ├── index.tsx
│   │   │   │   └── styles.ts
│   │   │   ├── ArticleList/
│   │   │   │   ├── index.tsx
│   │   │   │   └── styles.ts
│   │   │   ├── ArticleContent/
│   │   │   │   ├── index.tsx
│   │   │   │   └── styles.ts
│   │   │   ├── ArticleForm/
│   │   │   │   ├── index.tsx
│   │   │   │   └── styles.ts
│   │   │   └── MarkdownRenderer/
│   │   │       ├── index.tsx
│   │   │       └── styles.ts
│   │   │
│   │   ├── auth/                  # Componentes de autenticação
│   │   │   ├── AuthButton/
│   │   │   │   ├── index.tsx
│   │   │   │   └── styles.ts
│   │   │   ├── UserAvatar/
│   │   │   │   ├── index.tsx
│   │   │   │   └── styles.ts
│   │   │   └── ProtectedRoute/
│   │   │       ├── index.tsx
│   │   │       └── styles.ts
│   │   │
│   │   └── likes/                 # Componentes de avaliação
│   │       ├── LikeButton/
│   │       │   ├── index.tsx
│   │       │   └── styles.ts
│   │       └── LikeCounter/
│   │           ├── index.tsx
│   │           └── styles.ts
│   │
│   ├── hooks/                     # Hooks personalizados
│   │   ├── useArticles.ts
│   │   ├── useArticle.ts
│   │   ├── useAuth.ts
│   │   ├── useLike.ts
│   │   ├── useCachedFetch.ts
│   │   └── useInjection.ts
│   │
│   ├── contexts/                  # Contextos React
│   │   ├── AuthContext.tsx
│   │   └── DIContext.tsx
│   │
│   ├── layouts/                   # Layouts
│   │   ├── MainLayout/
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   └── AdminLayout/
│   │       ├── index.tsx
│   │       └── styles.ts
│   │
│   └── pages/                     # Páginas
│       ├── HomePage/
│       │   ├── index.tsx
│       │   └── styles.ts
│       ├── ArticlePage/
│       │   ├── index.tsx
│       │   └── styles.ts
│       ├── LoginPage/
│       │   ├── index.tsx
│       │   └── styles.ts
│       ├── admin/
│       │   ├── NewArticlePage/
│       │   │   ├── index.tsx
│       │   │   └── styles.ts
│       │   ├── EditArticlePage/
│       │   │   ├── index.tsx
│       │   │   └── styles.ts
│       │   └── DashboardPage/
│       │       ├── index.tsx
│       │       └── styles.ts
│       └── NotFoundPage/
│           ├── index.tsx
│           └── styles.ts
│
├── shared/                        # 📦 COMPARTILHADO
│   ├── types/                     # Tipos compartilhados
│   │   ├── api.ts                 # Tipos de resposta da API
│   │   └── common.ts             # Tipos utilitários
│   ├── utils/                     # Funções utilitárias puras
│   │   ├── slugify.ts
│   │   ├── dateFormat.ts
│   │   └── validators.ts
│   └── constants/                 # Constantes da aplicação
│       ├── cache.ts               # TTLs de cache
│       └── roles.ts               # Roles de usuário
│
├── App.tsx                        # Componente raiz
├── main.tsx                       # Entry point
└── vite-env.d.ts                  # Tipos do Vite
```

---

## 4. Camada Core — Regras de Negócio

### 4.1 Entidades

Todas as entidades são **interfaces TypeScript puras**, sem dependência de bibliotecas externas.

#### `Article.ts`

```typescript
export type ArticleStatus = 'draft' | 'published';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;          // Markdown
  excerpt: string;          // Resumo curto
  tags: string[];
  coverImage: string | null;
  authorId: string;
  authorName: string;
  status: ArticleStatus;
  likeCount: number;
  dislikeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// DTO para criação (sem campos gerados automaticamente)
export interface CreateArticleDTO {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  coverImage?: string;
  status?: ArticleStatus;
}

// DTO para atualização (todos opcionais)
export interface UpdateArticleDTO {
  title?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  coverImage?: string | null;
  status?: ArticleStatus;
}
```

#### `User.ts`

```typescript
export type UserRole = 'admin' | 'reader';

export interface AppUser {
  id: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  role: UserRole;
}

export interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
}
```

#### `LikeDislike.ts`

```typescript
export type LikeType = 'like' | 'dislike' | 'none';

export interface LikeDislike {
  userId: string;
  articleId: string;
  type: LikeType;
  createdAt: Date;
}

export interface ArticleLikesSummary {
  articleId: string;
  likeCount: number;
  dislikeCount: number;
  userVote: LikeType; // Voto do usuário logado (ou 'none')
}
```

#### `CacheEntry.ts`

```typescript
export interface CacheEntry<T> {
  data: T;
  timestamp: number;       // Unix timestamp
  ttl: number;             // Tempo de vida em milissegundos
  ipHash: string;          // Hash do IP para identificação
}

export function isCacheValid<T>(entry: CacheEntry<T>): boolean {
  return Date.now() - entry.timestamp < entry.ttl;
}
```

### 4.2 Ports (Interfaces)

#### `ArticleRepositoryPort.ts`

```typescript
import type { Article, CreateArticleDTO, UpdateArticleDTO } from '../entities/Article';

export interface ArticleRepositoryPort {
  getAll(): Promise<Article[]>;
  getById(id: string): Promise<Article | null>;
  getBySlug(slug: string): Promise<Article | null>;
  create(data: CreateArticleDTO, authorId: string, authorName: string): Promise<Article>;
  update(id: string, data: UpdateArticleDTO): Promise<Article>;
  delete(id: string): Promise<void>;
  getByAuthor(authorId: string): Promise<Article[]>;
}
```

#### `AuthRepositoryPort.ts`

```typescript
import type { AppUser } from '../entities/User';

export interface AuthRepositoryPort {
  loginWithGoogle(): Promise<AppUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AppUser | null>;
  onAuthStateChanged(callback: (user: AppUser | null) => void): () => void; // retorna unsubscribe
  isAdmin(userId: string): Promise<boolean>;
}
```

#### `LikeRepositoryPort.ts`

```typescript
import type { LikeType, ArticleLikesSummary } from '../entities/LikeDislike';

export interface LikeRepositoryPort {
  toggleLike(articleId: string, userId: string, type: LikeType): Promise<ArticleLikesSummary>;
  getUserVote(articleId: string, userId: string): Promise<LikeType>;
  getArticleSummary(articleId: string): Promise<Omit<ArticleLikesSummary, 'userVote'>>;
}
```

#### `CachePort.ts`

```typescript
import type { CacheEntry } from '../entities/CacheEntry';

export interface CachePort {
  get<T>(key: string): Promise<CacheEntry<T> | null>;
  set<T>(key: string, data: T, ttl: number): Promise<void>;
  invalidate(key: string): Promise<void>;
  invalidateByPrefix(prefix: string): Promise<void>;
}
```

### 4.3 Casos de Uso

Cada caso de uso é uma **classe** que recebe suas dependências via construtor (injeção de dependência).

#### `CreateArticleUseCase.ts`

```typescript
import type { ArticleRepositoryPort } from '../../ports/ArticleRepositoryPort';
import type { AuthRepositoryPort } from '../../ports/AuthRepositoryPort';
import type { Article, CreateArticleDTO } from '../../entities/Article';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { ValidationError } from '../../errors/ValidationError';
import { slugify } from '../../../shared/utils/slugify';

export class CreateArticleUseCase {
  constructor(
    private readonly articleRepo: ArticleRepositoryPort,
    private readonly authRepo: AuthRepositoryPort,
  ) {}

  async execute(data: CreateArticleDTO, userId: string): Promise<Article> {
    const isAdmin = await this.authRepo.isAdmin(userId);

    if (!isAdmin) {
      throw new UnauthorizedError('Apenas administradores podem criar artigos');
    }

    if (!data.title || data.title.trim().length === 0) {
      throw new ValidationError('O título do artigo é obrigatório');
    }

    if (!data.content || data.content.trim().length === 0) {
      throw new ValidationError('O conteúdo do artigo é obrigatório');
    }

    const user = await this.authRepo.getCurrentUser();

    if (!user) {
      throw new UnauthorizedError('Usuário não autenticado');
    }

    const articleData: CreateArticleDTO = {
      ...data,
      slug: slugify(data.title),
      status: data.status ?? 'draft',
    };

    return this.articleRepo.create(articleData, userId, user.displayName);
  }
}
```

#### `GetArticlesUseCase.ts`

```typescript
import type { ArticleRepositoryPort } from '../../ports/ArticleRepositoryPort';
import type { CachePort } from '../../ports/CachePort';
import type { Article } from '../../entities/Article';
import { CACHE_TTL } from '../../../shared/constants/cache';

export class GetArticlesUseCase {
  constructor(
    private readonly articleRepo: ArticleRepositoryPort,
    private readonly cache: CachePort,
  ) {}

  async execute(ipHash: string): Promise<Article[]> {
    const cacheKey = `articles_list_${ipHash}`;
    const cached = await this.cache.get<Article[]>(cacheKey);

    if (cached) {
      return cached.data;
    }

    const articles = await this.articleRepo.getAll();
    const publishedArticles = articles.filter((a) => a.status === 'published');

    await this.cache.set(cacheKey, publishedArticles, CACHE_TTL.ARTICLES_LIST);

    return publishedArticles;
  }
}
```

#### `ToggleLikeUseCase.ts`

```typescript
import type { LikeRepositoryPort } from '../../ports/LikeRepositoryPort';
import type { AuthRepositoryPort } from '../../ports/AuthRepositoryPort';
import type { ArticleLikesSummary, LikeType } from '../../entities/LikeDislike';
import { UnauthorizedError } from '../../errors/UnauthorizedError';

export class ToggleLikeUseCase {
  constructor(
    private readonly likeRepo: LikeRepositoryPort,
    private readonly authRepo: AuthRepositoryPort,
  ) {}

  async execute(articleId: string, userId: string, type: LikeType): Promise<ArticleLikesSummary> {
    const user = await this.authRepo.getCurrentUser();

    if (!user) {
      throw new UnauthorizedError('Você precisa estar logado para avaliar artigos');
    }

    if (type !== 'like' && type !== 'dislike' && type !== 'none') {
      throw new Error('Tipo de avaliação inválido');
    }

    return this.likeRepo.toggleLike(articleId, userId, type);
  }
}
```

#### `LoginUseCase.ts`

```typescript
import type { AuthRepositoryPort } from '../../ports/AuthRepositoryPort';
import type { AppUser } from '../../entities/User';

export class LoginUseCase {
  constructor(private readonly authRepo: AuthRepositoryPort) {}

  async execute(): Promise<AppUser> {
    const user = await this.authRepo.loginWithGoogle();
    return user;
  }
}
```

### 4.4 Erros de Domínio

```typescript
// DomainError.ts
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

// UnauthorizedError.ts
export class UnauthorizedError extends DomainError {
  constructor(message = 'Acesso não autorizado') {
    super(message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

// ValidationError.ts
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}
```

---

## 5. Camada de Adaptadores — Bibliotecas Externas

### 5.1 Firebase — Configuração Centralizada

```typescript
// adapters/firebase/firebaseConfig.ts
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

export function initializeFirebase(): void {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export function getFirebaseAuth(): Auth {
  return auth;
}

export function getFirebaseDb(): Firestore {
  return db;
}

export function getFirebaseStorage(): FirebaseStorage {
  return storage;
}
```

### 5.2 FirebaseArticleAdapter

```typescript
// adapters/firebase/FirebaseArticleAdapter.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  type Firestore,
} from 'firebase/firestore';
import type { ArticleRepositoryPort } from '../../core/ports/ArticleRepositoryPort';
import type { Article, CreateArticleDTO, UpdateArticleDTO } from '../../core/entities/Article';
import { v4 as uuidv4 } from 'uuid';

export class FirebaseArticleAdapter implements ArticleRepositoryPort {
  private readonly collectionName = 'articles';

  constructor(private readonly db: Firestore) {}

  async getAll(): Promise<Article[]> {
    const q = query(
      collection(this.db, this.collectionName),
      orderBy('createdAt', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(this.mapDocToArticle);
  }

  async getById(id: string): Promise<Article | null> {
    const docRef = doc(this.db, this.collectionName, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return this.mapDocToArticle(snapshot);
  }

  async getBySlug(slug: string): Promise<Article | null> {
    const q = query(
      collection(this.db, this.collectionName),
      where('slug', '==', slug),
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return this.mapDocToArticle(snapshot.docs[0]);
  }

  async create(data: CreateArticleDTO, authorId: string, authorName: string): Promise<Article> {
    const id = uuidv4();
    const now = new Date();

    const articleData = {
      ...data,
      id,
      authorId,
      authorName,
      likeCount: 0,
      dislikeCount: 0,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    };

    await setDoc(doc(this.db, this.collectionName, id), articleData);

    return {
      ...articleData,
      createdAt: now,
      updatedAt: now,
    };
  }

  async update(id: string, data: UpdateArticleDTO): Promise<Article> {
    const docRef = doc(this.db, this.collectionName, id);
    const updateData = {
      ...data,
      updatedAt: Timestamp.fromDate(new Date()),
    };
    await updateDoc(docRef, updateData);

    const updated = await this.getById(id);
    if (!updated) throw new Error(`Artigo ${id} não encontrado após atualização`);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.db, this.collectionName, id));
  }

  async getByAuthor(authorId: string): Promise<Article[]> {
    const q = query(
      collection(this.db, this.collectionName),
      where('authorId', '==', authorId),
      orderBy('createdAt', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(this.mapDocToArticle);
  }

  private mapDocToArticle(doc: { id: string; data: () => Record<string, unknown> }): Article {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title as string,
      slug: data.slug as string,
      content: data.content as string,
      excerpt: data.excerpt as string,
      tags: data.tags as string[],
      coverImage: data.coverImage as string | null,
      authorId: data.authorId as string,
      authorName: data.authorName as string,
      status: data.status as Article['status'],
      likeCount: data.likeCount as number,
      dislikeCount: data.dislikeCount as number,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    };
  }
}
```

### 5.3 FirebaseAuthAdapter

```typescript
// adapters/firebase/FirebaseAuthAdapter.ts
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import type { AuthRepositoryPort } from '../../core/ports/AuthRepositoryPort';
import type { AppUser, UserRole } from '../../core/entities/User';

export class FirebaseAuthAdapter implements AuthRepositoryPort {
  private readonly provider = new GoogleAuthProvider();

  async loginWithGoogle(): Promise<AppUser> {
    const auth = getAuth();
    const result = await signInWithPopup(auth, this.provider);
    return this.mapFirebaseUserToAppUser(result.user);
  }

  async logout(): Promise<void> {
    const auth = getAuth();
    await signOut(auth);
  }

  async getCurrentUser(): Promise<AppUser | null> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return this.mapFirebaseUserToAppUser(user);
  }

  onAuthStateChanged(callback: (user: AppUser | null) => void): () => void {
    const auth = getAuth();
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        callback(this.mapFirebaseUserToAppUser(firebaseUser));
      } else {
        callback(null);
      }
    });
  }

  async isAdmin(userId: string): Promise<boolean> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return false;

    // Obtém o token com as custom claims
    const idTokenResult = await user.getIdTokenResult();
    return idTokenResult.claims.admin === true;
  }

  private mapFirebaseUserToAppUser(firebaseUser: FirebaseUser): AppUser {
    return {
      id: firebaseUser.uid,
      displayName: firebaseUser.displayName ?? 'Usuário',
      email: firebaseUser.email ?? '',
      photoURL: firebaseUser.photoURL,
      role: 'reader', // Role padrão; admin é definido via custom claims
    };
  }
}
```

### 5.4 FirebaseLikeAdapter

```typescript
// adapters/firebase/FirebaseLikeAdapter.ts
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  increment,
  updateDoc,
  type Firestore,
} from 'firebase/firestore';
import type { LikeRepositoryPort } from '../../core/ports/LikeRepositoryPort';
import type { LikeType, ArticleLikesSummary } from '../../core/entities/LikeDislike';

export class FirebaseLikeAdapter implements LikeRepositoryPort {
  private readonly likesCollection = 'likes';
  private readonly articlesCollection = 'articles';

  constructor(private readonly db: Firestore) {}

  async toggleLike(
    articleId: string,
    userId: string,
    type: LikeType,
  ): Promise<ArticleLikesSummary> {
    const likeDocId = `${userId}_${articleId}`;
    const likeDocRef = doc(this.db, this.likesCollection, likeDocId);
    const articleRef = doc(this.db, this.articlesCollection, articleId);

    const existingLike = await getDoc(likeDocRef);
    const currentType = existingLike.exists()
      ? (existingLike.data().type as LikeType)
      : 'none';

    // Lógica de toggle
    if (currentType === type) {
      // Mesmo tipo → remove (neutro)
      await deleteDoc(likeDocRef);
      await this.updateArticleCounts(articleRef, currentType, 'remove');
    } else {
      // Tipo diferente ou novo → salva/atualiza
      await setDoc(likeDocRef, {
        userId,
        articleId,
        type,
        createdAt: new Date(),
      });

      if (currentType !== 'none') {
        // Remove o anterior, adiciona o novo
        await this.updateArticleCounts(articleRef, currentType, 'remove');
        await this.updateArticleCounts(articleRef, type, 'add');
      } else {
        // Novo voto
        await this.updateArticleCounts(articleRef, type, 'add');
      }
    }

    return this.getArticleSummary(articleId);
  }

  async getUserVote(articleId: string, userId: string): Promise<LikeType> {
    const likeDocId = `${userId}_${articleId}`;
    const likeDocRef = doc(this.db, this.likesCollection, likeDocId);
    const snapshot = await getDoc(likeDocRef);

    if (!snapshot.exists()) return 'none';
    return snapshot.data().type as LikeType;
  }

  async getArticleSummary(
    articleId: string,
  ): Promise<Omit<ArticleLikesSummary, 'userVote'>> {
    const articleRef = doc(this.db, this.articlesCollection, articleId);
    const snapshot = await getDoc(articleRef);

    if (!snapshot.exists()) {
      return { articleId, likeCount: 0, dislikeCount: 0 };
    }

    const data = snapshot.data();
    return {
      articleId,
      likeCount: (data.likeCount as number) ?? 0,
      dislikeCount: (data.dislikeCount as number) ?? 0,
    };
  }

  private async updateArticleCounts(
    articleRef: ReturnType<typeof doc>,
    type: LikeType,
    operation: 'add' | 'remove',
  ): Promise<void> {
    const value = operation === 'add' ? 1 : -1;
    const field = type === 'like' ? 'likeCount' : 'dislikeCount';
    await updateDoc(articleRef, { [field]: increment(value) });
  }
}
```

### 5.5 IPCacheAdapter

```typescript
// adapters/cache/IPCacheAdapter.ts
import type { CachePort } from '../../core/ports/CachePort';
import type { CacheEntry } from '../../core/entities/CacheEntry';
import { IPFetcher } from '../http/IPFetcher';

interface StorageData {
  data: unknown;
  timestamp: number;
  ttl: number;
  ipHash: string;
}

export class IPCacheAdapter implements CachePort {
  private readonly prefix = 'blog_cache';
  private ipHashPromise: Promise<string> | null = null;

  private async getIpHash(): Promise<string> {
    if (!this.ipHashPromise) {
      this.ipHashPromise = IPFetcher.getIPHash();
    }
    return this.ipHashPromise;
  }

  private buildKey(key: string, ipHash: string): string {
    return `${this.prefix}_${key}_${ipHash}`;
  }

  async get<T>(key: string): Promise<CacheEntry<T> | null> {
    const ipHash = await this.getIpHash();
    const storageKey = this.buildKey(key, ipHash);
    const raw = localStorage.getItem(storageKey);

    if (!raw) return null;

    try {
      const parsed: StorageData = JSON.parse(raw) as StorageData;
      const entry: CacheEntry<T> = {
        data: parsed.data as T,
        timestamp: parsed.timestamp,
        ttl: parsed.ttl,
        ipHash: parsed.ipHash,
      };

      if (Date.now() - entry.timestamp < entry.ttl) {
        return entry;
      }

      // Expirado
      localStorage.removeItem(storageKey);
      return null;
    } catch {
      localStorage.removeItem(storageKey);
      return null;
    }
  }

  async set<T>(key: string, data: T, ttl: number): Promise<void> {
    const ipHash = await this.getIpHash();
    const storageKey = this.buildKey(key, ipHash);

    const entry: StorageData = {
      data,
      timestamp: Date.now(),
      ttl,
      ipHash,
    };

    localStorage.setItem(storageKey, JSON.stringify(entry));
  }

  async invalidate(key: string): Promise<void> {
    const ipHash = await this.getIpHash();
    const storageKey = this.buildKey(key, ipHash);
    localStorage.removeItem(storageKey);
  }

  async invalidateByPrefix(prefix: string): Promise<void> {
    const ipHash = await this.getIpHash();
    const fullPrefix = this.buildKey(prefix, ipHash);

    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i);
      if (storageKey?.startsWith(fullPrefix)) {
        localStorage.removeItem(storageKey);
      }
    }
  }
}
```

### 5.6 IPFetcher

```typescript
// adapters/http/IPFetcher.ts
export class IPFetcher {
  private static ipHash: string | null = null;

  static async getIPHash(): Promise<string> {
    if (this.ipHash) return this.ipHash;

    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = (await response.json()) as { ip: string };
      this.ipHash = this.hashIP(data.ip);
    } catch {
      // Fallback: hash de um identificador local
      this.ipHash = this.hashIP('local-dev');
    }

    return this.ipHash;
  }

  private static hashIP(ip: string): string {
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
      const char = ip.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
}
```

---

## 6. Injeção de Dependência

### 6.1 Container

```typescript
// di/container.ts
import { getFirebaseDb, getFirebaseAuth } from '../adapters/firebase/firebaseConfig';
import { FirebaseArticleAdapter } from '../adapters/firebase/FirebaseArticleAdapter';
import { FirebaseAuthAdapter } from '../adapters/firebase/FirebaseAuthAdapter';
import { FirebaseLikeAdapter } from '../adapters/firebase/FirebaseLikeAdapter';
import { IPCacheAdapter } from '../adapters/cache/IPCacheAdapter';

import { CreateArticleUseCase } from '../core/use-cases/articles/CreateArticleUseCase';
import { GetArticlesUseCase } from '../core/use-cases/articles/GetArticlesUseCase';
import { GetArticleBySlugUseCase } from '../core/use-cases/articles/GetArticleBySlugUseCase';
import { UpdateArticleUseCase } from '../core/use-cases/articles/UpdateArticleUseCase';
import { DeleteArticleUseCase } from '../core/use-cases/articles/DeleteArticleUseCase';
import { LoginUseCase } from '../core/use-cases/auth/LoginUseCase';
import { LogoutUseCase } from '../core/use-cases/auth/LogoutUseCase';
import { GetCurrentUserUseCase } from '../core/use-cases/auth/GetCurrentUserUseCase';
import { ToggleLikeUseCase } from '../core/use-cases/likes/ToggleLikeUseCase';
import { GetArticleLikesUseCase } from '../core/use-cases/likes/GetArticleLikesUseCase';

// Instanciando adapters (uma única vez)
const db = getFirebaseDb();
const auth = getFirebaseAuth();

const articleRepo = new FirebaseArticleAdapter(db);
const authRepo = new FirebaseAuthAdapter(auth);
const likeRepo = new FirebaseLikeAdapter(db);
const cacheRepo = new IPCacheAdapter();

// Instanciando casos de uso com suas dependências
export const container = {
  // Repositories
  articleRepo,
  authRepo,
  likeRepo,
  cacheRepo,

  // Use Cases - Articles
  createArticleUseCase: new CreateArticleUseCase(articleRepo, authRepo),
  getArticlesUseCase: new GetArticlesUseCase(articleRepo, cacheRepo),
  getArticleBySlugUseCase: new GetArticleBySlugUseCase(articleRepo, cacheRepo),
  updateArticleUseCase: new UpdateArticleUseCase(articleRepo, authRepo),
  deleteArticleUseCase: new DeleteArticleUseCase(articleRepo, authRepo),

  // Use Cases - Auth
  loginUseCase: new LoginUseCase(authRepo),
  logoutUseCase: new LogoutUseCase(authRepo),
  getCurrentUserUseCase: new GetCurrentUserUseCase(authRepo),

  // Use Cases - Likes
  toggleLikeUseCase: new ToggleLikeUseCase(likeRepo, authRepo),
  getArticleLikesUseCase: new GetArticleLikesUseCase(likeRepo),
} as const;
```

### 6.2 Tipos do Container

```typescript
// di/types.ts
import type { container } from './container';

export type Container = typeof container;

// Tipo utilitário para extrair tipos dos use cases
export type UseCase<T extends keyof Container> = Container[T];
```

### 6.3 Contexto React para DI

```typescript
// presentation/contexts/DIContext.tsx
import { createContext, useContext, type ReactNode } from 'react';
import { container, type Container } from '../../di/container';

const DIContext = createContext<Container | null>(null);

interface DIProviderProps {
  children: ReactNode;
}

export function DIProvider({ children }: DIProviderProps): JSX.Element {
  return (
    <DIContext.Provider value={container}>
      {children}
    </DIContext.Provider>
  );
}

export function useDI(): Container {
  const context = useContext(DIContext);
  if (!context) {
    throw new Error('useDI deve ser usado dentro de DIProvider');
  }
  return context;
}
```

---

## 7. Camada de Apresentação — Componentes React

### 7.1 Padrão de Componente

Cada componente segue a mesma estrutura:

```
Componente/
  index.tsx    → Lógica + JSX (props, handlers, hooks)
  styles.ts    → Funções que retornam classes Tailwind
```

#### Exemplo: `Button/index.tsx`

```typescript
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { buttonStyles, type ButtonVariant, type ButtonSize } from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps): JSX.Element {
  const classes = buttonStyles({ variant, size, isLoading });

  return (
    <button
      className={`${classes} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          Carregando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
```

#### Exemplo: `Button/styles.ts`

```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonStyleParams {
  variant: ButtonVariant;
  size: ButtonSize;
  isLoading: boolean;
}

export function buttonStyles({ variant, size, isLoading }: ButtonStyleParams): string {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return `${base} ${variants[variant]} ${sizes[size]}`;
}
```

### 7.2 Componentes de UI Reutilizáveis

| Componente | Props | Descrição |
|---|---|---|
| **Button** | variant, size, isLoading, children | Botão com variantes de estilo |
| **Input** | label, error, ...inputProps | Input com label e mensagem de erro |
| **TextArea** | label, error, rows, ...textareaProps | Textarea com label |
| **LoadingSpinner** | size, className | Spinner de carregamento |
| **ErrorMessage** | message, onRetry? | Mensagem de erro com opção de retry |
| **CacheIndicator** | cachedAt: Date \| null | Badge indicando dados em cache |
| **Modal** | isOpen, onClose, title, children | Modal genérico |
| **ConfirmDialog** | message, onConfirm, onCancel | Diálogo de confirmação |

### 7.3 Componentes de Artigo

#### `ArticleCard/index.tsx`

```typescript
import { Link } from 'react-router-dom';
import type { Article } from '../../../core/entities/Article';
import { cardStyles } from './styles';
import { formatDate } from '../../../shared/utils/dateFormat';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps): JSX.Element {
  return (
    <article className={cardStyles.container}>
      {article.coverImage && (
        <img
          src={article.coverImage}
          alt={article.title}
          className={cardStyles.image}
        />
      )}
      <div className={cardStyles.content}>
        <div className={cardStyles.tags}>
          {article.tags.map((tag) => (
            <span key={tag} className={cardStyles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <Link to={`/artigo/${article.slug}`} className={cardStyles.titleLink}>
          <h2 className={cardStyles.title}>{article.title}</h2>
        </Link>
        <p className={cardStyles.excerpt}>{article.excerpt}</p>
        <div className={cardStyles.meta}>
          <span>{article.authorName}</span>
          <span>•</span>
          <time dateTime={article.createdAt.toISOString()}>
            {formatDate(article.createdAt)}
          </time>
        </div>
      </div>
    </article>
  );
}
```

#### `ArticleCard/styles.ts`

```typescript
export const cardStyles = {
  container:
    'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300',
  image:
    'w-full h-48 object-cover',
  content:
    'p-6',
  tags:
    'flex flex-wrap gap-2 mb-3',
  tag:
    'px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full',
  titleLink:
    'block hover:opacity-80 transition-opacity',
  title:
    'text-xl font-bold text-gray-900 mb-2 line-clamp-2',
  excerpt:
    'text-gray-600 mb-4 line-clamp-3',
  meta:
    'flex items-center gap-2 text-sm text-gray-500',
} as const;
```

### 7.4 Componentes de Autenticação

#### `AuthButton/index.tsx`

```typescript
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { UserAvatar } from './UserAvatar';

export function AuthButton(): JSX.Element {
  const { user, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <Button variant="ghost" isLoading disabled>Entrando...</Button>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <UserAvatar user={user} />
        <span className="text-sm text-gray-700">{user.displayName}</span>
        <Button variant="ghost" size="sm" onClick={logout}>
          Sair
        </Button>
      </div>
    );
  }

  return (
    <Button variant="primary" size="sm" onClick={login}>
      Entrar com Google
    </Button>
  );
}
```

#### `ProtectedRoute/index.tsx`

```typescript
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '../../../core/entities/User';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: UserRole;
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps): JSX.Element {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
```

### 7.5 Componentes de Like/Dislike

#### `LikeButton/index.tsx`

```typescript
import { useLike } from '../../hooks/useLike';
import { useAuth } from '../../hooks/useAuth';
import { likeButtonStyles } from './styles';
import type { LikeType } from '../../../core/entities/LikeDislike';

interface LikeButtonProps {
  articleId: string;
}

export function LikeButton({ articleId }: LikeButtonProps): JSX.Element {
  const { user } = useAuth();
  const { summary, isLoading, toggleVote } = useLike(articleId);

  const handleVote = (type: LikeType): void => {
    if (!user) return; // Redirecionar para login ou mostrar toast
    toggleVote(type);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleVote('like')}
        disabled={isLoading}
        className={likeButtonStyles({
          active: summary.userVote === 'like',
          disabled: isLoading,
        })}
        aria-label="Curtir"
      >
        <ThumbUpIcon />
        <span>{summary.likeCount}</span>
      </button>

      <button
        onClick={() => handleVote('dislike')}
        disabled={isLoading}
        className={likeButtonStyles({
          active: summary.userVote === 'dislike',
          disabled: isLoading,
        })}
        aria-label="Não curtir"
      >
        <ThumbDownIcon />
        <span>{summary.dislikeCount}</span>
      </button>
    </div>
  );
}

// Ícone inline (poderia ser um componente separado)
function ThumbUpIcon(): JSX.Element {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
    </svg>
  );
}

function ThumbDownIcon(): JSX.Element {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
    </svg>
  );
}
```

#### `LikeButton/styles.ts`

```typescript
interface LikeButtonStyleParams {
  active: boolean;
  disabled: boolean;
}

export function likeButtonStyles({ active, disabled }: LikeButtonStyleParams): string {
  const base = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors';

  const activeStyle = active
    ? 'bg-blue-100 text-blue-700'
    : 'bg-gray-100 text-gray-600 hover:bg-gray-200';

  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return `${base} ${activeStyle} ${disabledStyle}`;
}
```

### 7.6 Hooks Personalizados

#### `useAuth.ts`

```typescript
import { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useDI } from '../contexts/DIContext';
import type { AppUser } from '../../core/entities/User';

interface UseAuthReturn {
  user: AppUser | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

export function useAuth(): UseAuthReturn {
  const { user, isLoading, setUser } = useContext(AuthContext);
  const { loginUseCase, logoutUseCase } = useDI();

  const login = useCallback(async () => {
    const loggedUser = await loginUseCase.execute();
    setUser(loggedUser);
  }, [loginUseCase, setUser]);

  const logout = useCallback(async () => {
    await logoutUseCase.execute();
    setUser(null);
  }, [logoutUseCase, setUser]);

  return {
    user,
    isLoading,
    login,
    logout,
    isAdmin: user?.role === 'admin',
  };
}
```

#### `useLike.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import { useDI } from '../contexts/DIContext';
import { useAuth } from './useAuth';
import type { LikeType, ArticleLikesSummary } from '../../core/entities/LikeDislike';

interface UseLikeReturn {
  summary: ArticleLikesSummary;
  isLoading: boolean;
  toggleVote: (type: LikeType) => Promise<void>;
}

export function useLike(articleId: string): UseLikeReturn {
  const { toggleLikeUseCase, getArticleLikesUseCase } = useDI();
  const { user } = useAuth();

  const [summary, setSummary] = useState<ArticleLikesSummary>({
    articleId,
    likeCount: 0,
    dislikeCount: 0,
    userVote: 'none',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Carrega dados iniciais
  useEffect(() => {
    const loadSummary = async (): Promise<void> => {
      try {
        const articleSummary = await getArticleLikesUseCase.execute(articleId);
        let userVote: LikeType = 'none';

        if (user) {
          userVote = await toggleLikeUseCase.getUserVote(articleId, user.id);
        }

        setSummary({ ...articleSummary, userVote });
      } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
      }
    };

    loadSummary();
  }, [articleId, user, getArticleLikesUseCase, toggleLikeUseCase]);

  const toggleVote = useCallback(async (type: LikeType): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newSummary = await toggleLikeUseCase.execute(articleId, user.id, type);
      setSummary(newSummary);
    } catch (error) {
      console.error('Erro ao avaliar artigo:', error);
    } finally {
      setIsLoading(false);
    }
  }, [articleId, user, toggleLikeUseCase]);

  return { summary, isLoading, toggleVote };
}
```

#### `useCachedFetch.ts`

```typescript
import { useState, useEffect } from 'react';
import { useDI } from '../contexts/DIContext';

interface UseCachedFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isCached: boolean;
  cachedAt: Date | null;
}

export function useCachedFetch<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  ttl: number,
): UseCachedFetchResult<T> {
  const { cacheRepo } = useDI();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [cachedAt, setCachedAt] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // Tenta cache primeiro
        const cached = await cacheRepo.get<T>(cacheKey);

        if (cached) {
          setData(cached.data);
          setIsCached(true);
          setCachedAt(new Date(cached.timestamp));
          setIsLoading(false);
          return;
        }

        // Cache miss → busca dados frescos
        const freshData = await fetcher();
        await cacheRepo.set(cacheKey, freshData, ttl);

        setData(freshData);
        setIsCached(false);
        setCachedAt(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cacheKey, fetcher, ttl, cacheRepo]);

  return { data, isLoading, error, isCached, cachedAt };
}
```

---

## 8. Sistema de Cache por IP

### 8.1 Estratégia

1. **Identificação do IP:** Serviço externo [ipify](https://api.ipify.org) obtém o IP público
2. **Hash do IP:** O IP é convertido em hash (para não armazenar dados sensíveis)
3. **Chave de cache:** `{prefix}_{rota}_{hash_do_ip}`
4. **Armazenamento:** `localStorage` do navegador
5. **TTL configurável:** Definido por tipo de rota

### 8.2 Constantes de Cache

```typescript
// shared/constants/cache.ts
export const CACHE_TTL = {
  ARTICLES_LIST: 5 * 60 * 1000,      // 5 minutos
  ARTICLE_DETAIL: 10 * 60 * 1000,    // 10 minutos
  USER_DATA: 2 * 60 * 1000,          // 2 minutos
} as const;
```

### 8.3 CacheIndicator

```typescript
// presentation/components/ui/CacheIndicator/index.tsx
import { cacheIndicatorStyles } from './styles';

interface CacheIndicatorProps {
  cachedAt: Date | null;
}

export function CacheIndicator({ cachedAt }: CacheIndicatorProps): JSX.Element | null {
  if (!cachedAt) return null;

  const minutesAgo = Math.floor(
    (Date.now() - cachedAt.getTime()) / 1000 / 60,
  );

  return (
    <span className={cacheIndicatorStyles}>
      Dados em cache • {minutesAgo}min atrás
    </span>
  );
}
```

---

## 9. Autenticação e Autorização

### 9.1 Fluxo de Login

```
Usuário clica "Entrar com Google"
  → AuthButton chama useAuth().login()
    → LoginUseCase.execute()
      → FirebaseAuthAdapter.loginWithGoogle()
        → signInWithPopup(auth, GoogleAuthProvider)
          → Usuário escolhe conta Google
          → Firebase retorna FirebaseUser
        → mapFirebaseUserToAppUser()
      → Retorna AppUser
    → AuthContext atualiza estado global
  → UI reflete usuário logado
```

### 9.2 Admin Check com Custom Claims

Para definir um usuário como admin no Firebase:

1. **Firebase Console** → Authentication → Users → Adicionar custom claim:
   ```json
   { "admin": true }
   ```

2. **Ou via Firebase Admin SDK** (em um script separado):
   ```typescript
   const admin = require('firebase-admin');
   admin.auth().setCustomUserClaims(uid, { admin: true });
   ```

3. **Verificação no frontend** via `getIdTokenResult()`:
   ```typescript
   const idTokenResult = await user.getIdTokenResult();
   return idTokenResult.claims.admin === true;
   ```

### 9.3 AuthContext

```typescript
// presentation/contexts/AuthContext.tsx
import { createContext, useState, useEffect, type ReactNode } from 'react';
import { useDI } from './DIContext';
import type { AppUser } from '../../core/entities/User';

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  setUser: (user: AppUser | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  setUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const { getCurrentUserUseCase, authRepo } = useDI();
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se já tem usuário logado
    getCurrentUserUseCase.execute()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));

    // Escuta mudanças de autenticação
    const unsubscribe = authRepo.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [getCurrentUserUseCase, authRepo]);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## 10. Sistema de Like/Dislike

### 10.1 Estrutura no Firestore

```
Coleção: articles
  Documento: {articleId}
    likeCount: number
    dislikeCount: number

Coleção: likes
  Documento: {userId}_{articleId}
    userId: string
    articleId: string
    type: 'like' | 'dislike'
    createdAt: timestamp
```

### 10.2 Lógica de Toggle

```
Estado atual: none
  → Usuário clica "like"   → likeCount++   → estado: like
  → Usuário clica "dislike" → dislikeCount++ → estado: dislike

Estado atual: like
  → Usuário clica "like"   → likeCount--   → estado: none
  → Usuário clica "dislike" → likeCount--, dislikeCount++ → estado: dislike

Estado atual: dislike
  → Usuário clica "like"   → dislikeCount--, likeCount++ → estado: like
  → Usuário clica "dislike" → dislikeCount-- → estado: none
```

### 10.3 Atualização Atômica

Uso de `firebase.firestore.FieldValue.increment()` para garantir consistência:

```typescript
await updateDoc(articleRef, {
  likeCount: increment(1),   // ou increment(-1) para remover
});
```

---

## 11. Rotas e Navegação

### 11.1 Configuração de Rotas

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DIProvider } from './presentation/contexts/DIContext';
import { AuthProvider } from './presentation/contexts/AuthContext';
import { MainLayout } from './presentation/layouts/MainLayout';
import { AdminLayout } from './presentation/layouts/AdminLayout';
import { ProtectedRoute } from './presentation/components/auth/ProtectedRoute';
import { HomePage } from './presentation/pages/HomePage';
import { ArticlePage } from './presentation/pages/ArticlePage';
import { LoginPage } from './presentation/pages/LoginPage';
import { NewArticlePage } from './presentation/pages/admin/NewArticlePage';
import { EditArticlePage } from './presentation/pages/admin/EditArticlePage';
import { DashboardPage } from './presentation/pages/admin/DashboardPage';
import { NotFoundPage } from './presentation/pages/NotFoundPage';

export function App(): JSX.Element {
  return (
    <DIProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              {/* Rotas públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/artigo/:slug" element={<ArticlePage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Rotas de admin (protegidas) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="novo" element={<NewArticlePage />} />
                <Route path="editar/:id" element={<EditArticlePage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </DIProvider>
  );
}
```

### 11.2 Tabela de Rotas

| Rota | Página | Cache | Acesso |
|---|---|---|---|
| `/` | HomePage | 5min | Público |
| `/artigo/:slug` | ArticlePage | 10min | Público |
| `/login` | LoginPage | Não | Público |
| `/admin` | DashboardPage | Não | Admin |
| `/admin/novo` | NewArticlePage | Não | Admin |
| `/admin/editar/:id` | EditArticlePage | Não | Admin |
| `*` | NotFoundPage | Não | Público |

---

## 12. Estilo com Tailwind CSS

### 12.1 Configuração

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
};

export default config;
```

### 12.2 Princípios de Estilo

1. **Cada componente tem seu `styles.ts`** — Nunca misturar classes Tailwind no JSX
2. **Objetos de estilo** — Usar objetos `as const` para garantir tipagem
3. **Funções de estilo** — Para estilos dinâmicos (variantes, estados)
4. **Responsivo** — Mobile-first com breakpoints `sm:`, `md:`, `lg:`, `xl:`
5. **Dark mode** — Preparado com `dark:` variants (opcional)

### 12.3 Exemplo de Página com Estilo

```typescript
// presentation/pages/HomePage/styles.ts
export const homePageStyles = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
  header: 'text-center mb-12',
  title: 'text-4xl font-bold text-gray-900 mb-4',
  subtitle: 'text-lg text-gray-600 max-w-2xl mx-auto',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  emptyState: 'text-center py-12 text-gray-500',
  loadingContainer: 'flex justify-center py-12',
  errorContainer: 'max-w-md mx-auto py-12',
} as const;
```

---

## 13. Fluxo de Dados Completo

### 13.1 Leitura de Artigos (Home Page)

```
HomePage
  → useCachedFetch('articles_list', fetchArticles, 5min)
    → cacheRepo.get('articles_list_{ip_hash}')
      ├── Cache HIT → retorna dados do cache → isCached = true
      └── Cache MISS → GetArticlesUseCase.execute(ipHash)
          → articleRepo.getAll()
            → FirebaseArticleAdapter.getAll()
              → Firestore: collection('articles').orderBy('createdAt', 'desc')
            → Filtra apenas published
          → cacheRepo.set('articles_list_{ip_hash}', articles, 5min)
          → Retorna dados frescos → isCached = false
  → Renderiza ArticleList
    → Para cada artigo: ArticleCard
```

### 13.2 Leitura de Artigo Individual

```
ArticlePage
  → useParams() pega slug
  → useCachedFetch(`article_${slug}`, fetchArticle, 10min)
    → cacheRepo.get(`article_${slug}_{ip_hash}`)
      ├── Cache HIT → retorna
      └── Cache MISS → GetArticleBySlugUseCase.execute(slug, ipHash)
          → articleRepo.getBySlug(slug)
            → FirebaseArticleAdapter.getBySlug(slug)
              → Firestore: where('slug', '==', slug)
          → cacheRepo.set(...)
  → Renderiza ArticleContent + MarkdownRenderer + LikeButton
```

### 13.3 Like/Dislike

```
Usuário logado clica "like"
  → LikeButton.onClick('like')
    → useLike.toggleVote('like')
      → ToggleLikeUseCase.execute(articleId, userId, 'like')
        → Verifica se usuário está logado
        → likeRepo.toggleLike(articleId, userId, 'like')
          → FirebaseLikeAdapter.toggleLike()
            → Verifica voto atual
            → Atualiza/remove documento na coleção 'likes'
            → Atualiza likeCount/dislikeCount atomicamente
          → Retorna ArticleLikesSummary atualizado
      → Atualiza estado do hook
    → UI reflete novo estado
```

### 13.4 Criação de Artigo (Admin)

```
Admin preenche formulário → clica "Publicar"
  → ArticleForm.onSubmit(data)
    → CreateArticleUseCase.execute(data, userId)
      → Verifica se é admin (isAdmin)
      → Valida campos obrigatórios
      → Gera slug
      → articleRepo.create(data, userId, authorName)
        → FirebaseArticleAdapter.create()
          → Cria documento no Firestore
        → Retorna Article criado
      → Invalida cache de listagem
    → Redireciona para página do artigo
```

---

## 14. Firebase Security Rules

### 14.1 Regras do Firestore

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ==========================================
    // ARTIGOS
    // ==========================================
    match /articles/{articleId} {

      // Qualquer pessoa pode ler artigos publicados
      allow read: if resource.data.status == 'published';

      // Admins podem ler rascunhos
      allow read: if request.auth != null
        && request.auth.token.admin == true;

      // Apenas admins autenticados podem criar
      allow create: if request.auth != null
        && request.auth.token.admin == true
        && request.resource.data.keys().hasAll(['title', 'content', 'slug']);

      // Apenas admins autenticados podem atualizar
      allow update: if request.auth != null
        && request.auth.token.admin == true;

      // Apenas admins autenticados podem deletar
      allow delete: if request.auth != null
        && request.auth.token.admin == true;
    }

    // ==========================================
    // LIKES / DISLIKES
    // ==========================================
    match /likes/{likeId} {

      // Usuário pode ler seus próprios votos
      allow read: if request.auth != null
        && request.auth.uid == resource.data.userId;

      // Usuário pode criar/atualizar apenas seu próprio voto
      allow write: if request.auth != null
        && request.auth.uid == request.resource.data.userId
        && request.resource.data.articleId != null
        && request.resource.data.type in ['like', 'dislike'];
    }

    // ==========================================
    // REGRA PADRÃO (negar tudo)
    // ==========================================
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 14.2 Regras do Storage

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Imagens de capa dos artigos
    match /covers/{articleId}/{fileName} {

      // Qualquer um pode ler
      allow read: if true;

      // Apenas admins autenticados podem fazer upload
      allow write: if request.auth != null
        && request.auth.token.admin == true
        && request.resource.size < 5 * 1024 * 1024 // 5MB max
        && request.resource.contentType.matches('image/.*');
    }

    // Avatares de usuário
    match /avatars/{userId}/{fileName} {

      // Qualquer um pode ler
      allow read: if true;

      // Apenas o próprio usuário pode fazer upload
      allow write: if request.auth != null
        && request.auth.uid == userId
        && request.resource.size < 2 * 1024 * 1024 // 2MB max
        && request.resource.contentType.matches('image/.*');
    }

    // Regra padrão
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 15. Tratamento de Erros

### 15.1 Estratégia

| Camada | Estratégia |
|---|---|
| **Core (Use Cases)** | Lança `DomainError` (ou subclasses) |
| **Adapters** | Captura erros de bibliotecas, relança como `DomainError` |
| **Hooks** | Captura erros, expõe via estado `error` |
| **Componentes** | Renderiza `ErrorMessage` ou toast |
| **Limite da aplicação** | Error Boundary captura erros não tratados |

### 15.2 Error Boundary

```typescript
// presentation/components/ui/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    // Aqui poderia enviar para um serviço de monitoramento (Sentry, etc.)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorMessage
          message={this.state.error?.message ?? 'Ocorreu um erro inesperado'}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}
```

### 15.3 Mapeamento de Erros

```typescript
// presentation/utils/errorMapping.ts
import { DomainError } from '../../core/errors/DomainError';
import { UnauthorizedError } from '../../core/errors/UnauthorizedError';
import { ValidationError } from '../../core/errors/ValidationError';

interface MappedError {
  message: string;
  variant: 'error' | 'warning' | 'info';
}

export function mapErrorToUserMessage(error: unknown): MappedError {
  if (error instanceof UnauthorizedError) {
    return {
      message: 'Você não tem permissão para realizar esta ação.',
      variant: 'warning',
    };
  }

  if (error instanceof ValidationError) {
    return {
      message: error.message,
      variant: 'warning',
    };
  }

  if (error instanceof DomainError) {
    return {
      message: error.message,
      variant: 'error',
    };
  }

  // Erro genérico (rede, servidor, etc.)
  return {
    message: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
    variant: 'error',
  };
}
```

---

## 16. Testes

### 16.1 Estratégia de Testes

| Tipo | Ferramenta | O que testar |
|---|---|---|
| **Unitários** | Vitest | Core (entidades, use cases, utils) |
| **Integração** | Vitest + Testing Library | Adapters, hooks, componentes |
| **E2E** | Playwright | Fluxos completos (login, CRUD) |

### 16.2 Testes Unitários — Core

```typescript
// core/use-cases/articles/__tests__/CreateArticleUseCase.test.ts
import { describe, it, expect, vi } from 'vitest';
import { CreateArticleUseCase } from '../CreateArticleUseCase';
import type { ArticleRepositoryPort } from '../../../ports/ArticleRepositoryPort';
import type { AuthRepositoryPort } from '../../../ports/AuthRepositoryPort';
import { UnauthorizedError } from '../../../errors/UnauthorizedError';
import { ValidationError } from '../../../errors/ValidationError';

describe('CreateArticleUseCase', () => {
  const mockArticleRepo: ArticleRepositoryPort = {
    getAll: vi.fn(),
    getById: vi.fn(),
    getBySlug: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getByAuthor: vi.fn(),
  };

  const mockAuthRepo: AuthRepositoryPort = {
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    onAuthStateChanged: vi.fn(),
    isAdmin: vi.fn(),
  };

  const useCase = new CreateArticleUseCase(mockArticleRepo, mockAuthRepo);

  it('deve lançar UnauthorizedError se usuário não for admin', async () => {
    vi.mocked(mockAuthRepo.isAdmin).mockResolvedValue(false);

    await expect(
      useCase.execute({
        title: 'Teste',
        content: 'Conteúdo',
        excerpt: 'Resumo',
        tags: [],
      }, 'user-id'),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('deve lançar ValidationError se título estiver vazio', async () => {
    vi.mocked(mockAuthRepo.isAdmin).mockResolvedValue(true);

    await expect(
      useCase.execute({
        title: '',
        content: 'Conteúdo',
        excerpt: 'Resumo',
        tags: [],
      }, 'user-id'),
    ).rejects.toThrow(ValidationError);
  });

  it('deve criar artigo com sucesso se for admin', async () => {
    vi.mocked(mockAuthRepo.isAdmin).mockResolvedValue(true);
    vi.mocked(mockAuthRepo.getCurrentUser).mockResolvedValue({
      id: 'admin-id',
      displayName: 'Admin',
      email: 'admin@blog.com',
      photoURL: null,
      role: 'admin',
    });

    const mockArticle = {
      id: '123',
      title: 'Meu Artigo',
      slug: 'meu-artigo',
      content: 'Conteúdo do artigo',
      excerpt: 'Resumo',
      tags: ['react'],
      coverImage: null,
      authorId: 'admin-id',
      authorName: 'Admin',
      status: 'draft' as const,
      likeCount: 0,
      dislikeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockArticleRepo.create).mockResolvedValue(mockArticle);

    const result = await useCase.execute({
      title: 'Meu Artigo',
      content: 'Conteúdo do artigo',
      excerpt: 'Resumo',
      tags: ['react'],
    }, 'admin-id');

    expect(result).toEqual(mockArticle);
    expect(mockArticleRepo.create).toHaveBeenCalledOnce();
  });
});
```

### 16.3 Testes de Componentes

```typescript
// presentation/components/ui/__tests__/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('deve renderizar com texto', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByText('Clique aqui')).toBeDefined();
  });

  it('deve chamar onClick quando clicado', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Clique</Button>);
    fireEvent.click(screen.getByText('Clique'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('deve desabilitar quando isLoading for true', () => {
    render(<Button isLoading>Salvar</Button>);
    const button = screen.getByRole('button');
    expect(button.getAttribute('disabled')).toBeDefined();
  });

  it('deve mostrar spinner quando isLoading for true', () => {
    render(<Button isLoading>Salvar</Button>);
    expect(screen.getByText('Carregando...')).toBeDefined();
  });
});
```

### 16.4 Comandos

```bash
# Rodar todos os testes
npm run test

# Rodar testes com watch mode
npm run test:watch

# Rodar testes com cobertura
npm run test:coverage

# Rodar testes E2E (Playwright)
npm run test:e2e
```

---

## 🎯 Resumo Final

```
Blog Lucas
├── 🧠 Core (TypeScript puro)
│   ├── Entidades: Article, User, LikeDislike, CacheEntry
│   ├── Ports: ArticleRepository, AuthRepository, LikeRepository, Cache
│   └── Use Cases: CRUD artigos, Auth, Likes
│
├── 🔌 Adapters (Firebase, localStorage, ipify)
│   ├── FirebaseArticleAdapter
│   ├── FirebaseAuthAdapter
│   ├── FirebaseLikeAdapter
│   ├── IPCacheAdapter
│   └── IPFetcher
│
├── 💉 DI Container
│   └── Instancia e conecta tudo
│
└── 🎨 Presentation (React + Tailwind)
    ├── Components: UI, Article, Auth, Likes
    ├── Hooks: useAuth, useLike, useCachedFetch
    ├── Contexts: AuthContext, DIContext
    ├── Layouts: MainLayout, AdminLayout
    └── Pages: Home, Article, Login, Admin CRUD, 404
```

---

> **Arquitetura desenvolvida com ❤️ seguindo princípios de Clean Architecture, SOLID e boas práticas React + TypeScript.**


