# 📋 Blog Lucas — TODO List por Sprints (v2)

> **Baseado na arquitetura:** `.rulescline/ARCHITECTURE2.md`  
> **Stack:** React 19+ · TypeScript 5+ · Vite 8+ · Firebase 12+ · Tailwind CSS 4+ · React Router 7+  
> **Tema:** Dracula Dark  
> **Roles:** admin · writer · reader

---

## 🗺️ Visão Geral das Sprints

| Sprint | Foco | Status |
|---|---|---|
| **Sprint 0** | Setup do Projeto | ✅ Concluído |
| **Sprint 1** | Core — Regras de Negócio | ✅ Concluído |
| **Sprint 2** | Adapters — Firebase & Cache | ✅ Concluído |
| **Sprint 3** | DI Container & Contextos | ✅ Concluído |
| **Sprint 4** | Componentes de UI | ✅ Concluído |
| **Sprint 5** | Páginas Públicas | ✅ Concluído |
| **Sprint 6** | Autenticação & Autorização | ✅ Concluído |
| **Sprint 7** | Sistema de Like/Dislike | ✅ Concluído |
| **Sprint 8** | Admin — CRUD de Artigos | ✅ Concluído |
| **Sprint 9** | Sistema de Writer Requests (v2) | ✅ Concluído |
| **Sprint 10** | Cache por IP & Performance | 🟡 Parcial |
| **Sprint 11** | Testes | ⬜ Pendente |
| **Sprint 12** | Polimento & Deploy | ⬜ Pendente |

---

## 🏁 Sprint 0 — Setup do Projeto

**Objetivo:** Inicializar o projeto com Vite + React + TypeScript, configurar ferramentas e dependências.

- [x] **0.1** Criar projeto com Vite (`npm create vite@latest`)
- [x] **0.2** Instalar dependências principais (firebase, react-router-dom, react-markdown, uuid)
- [x] **0.3** Configurar Tailwind CSS v4 com `@theme` Dracula Dark
- [x] **0.4** Configurar TypeScript strict mode
- [x] **0.5** Configurar ESLint
- [x] **0.6** Configurar variáveis de ambiente (`.env.example`)
- [x] **0.7** Criar estrutura de diretórios vazia
- [x] **0.8** Configurar `vite.config.ts` com path aliases (`@/` → `src/`)
- [x] **0.9** Verificar que `npm run dev` funciona

---

## 🧠 Sprint 1 — Core: Regras de Negócio

**Objetivo:** Implementar toda a camada core (entidades, ports, use cases, erros).

### 1.1 Entidades

- [x] **1.1.1** `Article.ts` — Interface `Article`, `CreateArticleDTO`, `UpdateArticleDTO`, `ArticleStatus`
- [x] **1.1.2** `User.ts` — Interface `AppUser`, `AuthState`, `UserRole` (`'admin' | 'writer' | 'reader'`)
- [x] **1.1.3** `LikeDislike.ts` — Interface `LikeDislike`, `ArticleLikesSummary`, `LikeType`
- [x] **1.1.4** `CacheEntry.ts` — Interface `CacheEntry<T>`, `isCacheValid()`

### 1.2 Ports (Interfaces)

- [x] **1.2.1** `ArticleRepositoryPort.ts`
- [x] **1.2.2** `AuthRepositoryPort.ts` (com `isAdmin()` + `isWriter()`)
- [x] **1.2.3** `LikeRepositoryPort.ts`
- [x] **1.2.4** `CachePort.ts`

### 1.3 Erros de Domínio

- [x] **1.3.1** `DomainError.ts`
- [x] **1.3.2** `UnauthorizedError.ts`
- [x] **1.3.3** `ValidationError.ts`

### 1.4 Use Cases — Articles

- [x] **1.4.1** `CreateArticleUseCase.ts` — Validar admin/writer, validar campos, gerar slug
- [x] **1.4.2** `GetArticlesUseCase.ts` — Buscar publicados com cache
- [x] **1.4.3** `GetArticleBySlugUseCase.ts` — Buscar por slug com cache
- [x] **1.4.4** `UpdateArticleUseCase.ts` — Validar autor/admin, atualizar, invalidar cache
- [x] **1.4.5** `DeleteArticleUseCase.ts` — Validar admin, deletar, invalidar cache

### 1.5 Use Cases — Auth

- [x] **1.5.1** `LoginUseCase.ts`
- [x] **1.5.2** `LogoutUseCase.ts`
- [x] **1.5.3** `GetCurrentUserUseCase.ts`

### 1.6 Use Cases — Likes

- [x] **1.6.1** `ToggleLikeUseCase.ts` — Validar login, alternar like/dislike
- [x] **1.6.2** `GetArticleLikesUseCase.ts` — Obter resumo de avaliações

### 1.7 Shared — Utilitários

- [x] **1.7.1** `slugify.ts`
- [x] **1.7.2** `dateFormat.ts`
- [x] **1.7.3** `validators.ts`
- [x] **1.7.4** `cache.ts` — Constantes de TTL
- [x] **1.7.5** `roles.ts` — Constantes de roles
- [x] **1.7.6** `api.ts` — Tipos de resposta padronizados
- [x] **1.7.7** `common.ts` — Tipos utilitários genéricos

---

## 🔌 Sprint 2 — Adapters: Firebase & Cache

**Objetivo:** Implementar os adapters que conectam o core às bibliotecas externas.

### 2.1 Firebase Config

- [x] **2.1.1** `firebaseConfig.ts` — Inicializar Firebase, exportar `getFirebaseAuth()`, `getFirebaseDb()`, `getFirebaseStorage()`

### 2.2 Firebase Adapters

- [x] **2.2.1** `FirebaseArticleAdapter.ts` — Implementar `ArticleRepositoryPort`
- [x] **2.2.2** `FirebaseAuthAdapter.ts` — Implementar `AuthRepositoryPort` (login Google, logout, `isAdmin()`, `isWriter()`)
- [x] **2.2.3** `FirebaseLikeAdapter.ts` — Implementar `LikeRepositoryPort`, atualização atômica com `increment()`

### 2.3 Cache & HTTP

- [x] **2.3.1** `IPFetcher.ts` — Função pura `getIPHash()` via api.ipify.org
- [x] **2.3.2** `IPCacheAdapter.ts` — Implementar `CachePort`, chave composta `{prefix}_{key}_{ipHash}`, recebe `ipHash` via construtor

---

## 💉 Sprint 3 — DI Container & Contextos

**Objetivo:** Configurar a injeção de dependência e os contextos React.

### 3.1 DI Container (Assíncrono — v2)

- [x] **3.1.1** `types.ts` — Tipo `Container`
- [x] **3.1.2** `container.ts` — Função assíncrona `createContainer()`:
  - Resolve IP hash para isolamento do cache
  - Instancia todos os adapters (singleton)
  - Instancia todos os use cases com suas dependências
  - Inclui `UpdateArticleUseCase` e `DeleteArticleUseCase` com `CachePort`

### 3.2 Contextos React (Definições Separadas — v2)

- [x] **3.2.1** `DIContextDefinition.ts` + `DIContext.tsx` — Provider e hook `useDI()` com validação
- [x] **3.2.2** `AuthContextDefinition.ts` + `AuthContext.tsx` — Provider com `isAdmin` + `isWriter`, hook `useAuth()`

---

## 🎨 Sprint 4 — Componentes de UI

**Objetivo:** Criar todos os componentes reutilizáveis de UI com estilo Dracula Dark (Tailwind CSS v4 `@theme`).

### 4.1 Componentes Base (`src/presentation/components/ui/`)

- [x] **4.1.1** `Button.tsx` — Variantes: primary, secondary, danger, ghost; loading state
- [x] **4.1.2** `Input.tsx` — Label, erro, placeholder
- [x] **4.1.3** `TextArea.tsx` — Label, erro, rows configurável
- [x] **4.1.4** `LoadingSpinner.tsx` — Tamanhos sm, md, lg
- [x] **4.1.5** `ErrorMessage.tsx` — Mensagem de erro + retry
- [x] **4.1.6** `CacheIndicator.tsx` — Badge "Dados em cache • Xmin atrás"
- [x] **4.1.7** `Modal.tsx` — Overlay, título, conteúdo, fechar
- [x] **4.1.8** `ConfirmDialog.tsx` — Mensagem, confirmar, cancelar
- [x] **4.1.9** `ErrorBoundary.tsx` — Captura erros não tratados
- [x] **4.1.10** `Icon.tsx` — Ícones SVG reutilizáveis

### 4.2 Tema Dracula Dark

- [x] **4.2.1** Cores Dracula definidas via `@theme` no `index.css` (Tailwind CSS v4)
- [x] **4.2.2** Estilos globais: fundo escuro, scrollbar customizada, seleção de texto

---

## 📄 Sprint 5 — Páginas Públicas

**Objetivo:** Implementar as páginas públicas do blog.

### 5.1 Hooks

- [x] **5.1.1** `useArticles.ts` — Listar artigos com cache (5min)
- [x] **5.1.2** `useArticle.ts` — Buscar artigo por slug com cache (10min)
- [x] **5.1.3** `useCachedFetch.ts` — Hook genérico de cache
- [x] **5.1.4** `useInjection.ts` — Wrapper do `useDI`
- [x] **5.1.5** `useDI.ts` — Consumir container DI

### 5.2 Componentes de Artigo

- [x] **5.2.1** `ArticleCard/` — Card com capa, tags, título, excerpt, autor, data
- [x] **5.2.2** `ArticleList/` — Grid de cards com estados loading/empty/error
- [x] **5.2.3** `ArticleContent/` — Layout completo do artigo
- [x] **5.2.4** `MarkdownRenderer/` — Renderizar Markdown com tema Dracula

### 5.3 Páginas

- [x] **5.3.1** `HomePage/` — Hero + grid de artigos, loading skeleton, empty state
- [x] **5.3.2** `ArticlePage/` — Artigo completo + LikeButton + CacheIndicator
- [x] **5.3.3** `LoginPage/` — Botão "Entrar com Google", redirecionar se logado
- [x] **5.3.4** `NotFoundPage/` — 404 com link para home

### 5.4 Layouts

- [x] **5.4.1** `MainLayout/` — Header sticky (logo, nav, AuthButton), footer, outlet
- [x] **5.4.2** `AdminLayout/` — Sidebar fixa + header sticky + outlet, responsivo

---

## 🔐 Sprint 6 — Autenticação & Autorização (3 Roles)

**Objetivo:** Login com Google, gerenciamento de sessão, proteção de rotas com 3 níveis.

### 6.1 Componentes de Auth

- [x] **6.1.1** `UserAvatar/` — Foto ou iniciais, tooltip com nome/email
- [x] **6.1.2** `AuthButton/` — Login Google / avatar + nome + sair, loading state
- [x] **6.1.3** `ProtectedRoute/` — Proteção com `requireAdmin` e `requireWriter`

### 6.2 Hook de Auth

- [x] **6.2.1** `useAuth.ts` — Consome `AuthContext`, expõe `user`, `isLoading`, `login()`, `logout()`, `isAdmin`, `isWriter`

### 6.3 Firebase Custom Claims

- [x] **6.3.1** `scripts/set-admin.js` — Script para definir admin via Firebase Admin SDK
- [x] **6.3.2** `scripts/set-role.js` — Script para definir roles customizadas (admin/writer)

---

## 👍 Sprint 7 — Sistema de Like/Dislike

**Objetivo:** Avaliação de artigos com like/dislike (API refatorada v2).

### 7.1 Componentes de Like

- [x] **7.1.1** `LikeButton/` — Botões like/dislike com ícones SVG, estado ativo/inativo, desabilitado sem login
- [x] **7.1.2** `LikeCounter/` — Total de likes/dislikes, barra de proporção

### 7.2 Hook de Like (API v2)

- [x] **7.2.1** `useLike.ts` — API refatorada:
  - `likeCount`, `dislikeCount`, `userVote`, `isLoading`, `error`
  - `toggleLike()` — Alterna entre 'like' e 'none'
  - `toggleDislike()` — Alterna entre 'dislike' e 'none'
  - `refetch()` — Recarrega dados

---

## ✏️ Sprint 8 — Admin: CRUD de Artigos

**Objetivo:** Painel administrativo para writers e admins gerenciarem artigos.

### 8.1 Componente de Formulário

- [x] **8.1.1** `ArticleForm/` — Campos: título, conteúdo (Markdown), excerpt, tags, coverImage, status; preview Markdown ao vivo; validação; loading state

### 8.2 Páginas Admin

- [x] **8.2.1** `DashboardPage/` — Cards de estatísticas (total, publicados, rascunhos, likes), tabela de artigos, ações: editar, deletar, alternar status, ConfirmDialog para exclusão
- [x] **8.2.2** `NewArticlePage/` — Formulário para criar artigo, redirecionar após sucesso
- [x] **8.2.3** `EditArticlePage/` — Carregar artigo, formulário pré-preenchido, salvar alterações, estados loading/error/not found

---

## 🆕 Sprint 9 — Sistema de Solicitação de Writer (v2)

**Objetivo:** Permitir que readers solicitem para se tornar writers, com fluxo de aprovação pelo admin.

> **Baseado em:** ARCHITECTURE2.md — Seções 4, 5, 6, 7, 11, 12, 14

### 9.1 Entidade — WriterRequest

- [x] **9.1.1** `WriterRequest.ts` — Interface `WriterRequest`, `CreateWriterRequestDTO`, `UpdateWriterRequestDTO`, tipo `WriterRequestStatus`

### 9.2 Port — WriterRequestRepositoryPort

- [x] **9.2.1** `WriterRequestRepositoryPort.ts` — Métodos: `createRequest`, `findByUserId`, `findAll`, `updateRequest`

### 9.3 Use Cases — Writer Requests

- [x] **9.3.1** `RequestWriterUseCase.ts` — Reader solicita ser writer:
  - Valida autenticação
  - Valida que é reader (não admin, não writer)
  - Não permite solicitação duplicada pendente
- [x] **9.3.2** `GetWriterRequestsUseCase.ts` — Admin lista solicitações:
  - Apenas admin pode listar
  - Filtro opcional por status
- [x] **9.3.3** `ApproveWriterUseCase.ts` — Admin aprova/rejeita:
  - Apenas admin pode gerenciar
  - Atualiza status e marca reviewer

### 9.4 Firebase Adapter

- [x] **9.4.1** `FirebaseWriterRequestAdapter.ts` — Implementa `WriterRequestRepositoryPort`:
  - Coleção Firestore: `writerRequests`
  - Campos: userId, userEmail, userDisplayName, status, requestedAt, reviewedAt, reviewedBy

### 9.5 DI Container

- [x] **9.5.1** `container.ts` — Instanciar `FirebaseWriterRequestAdapter` e 3 use cases de writer

### 9.6 Hook — useWriterRequest

- [x] **9.6.1** `useWriterRequest.ts` — Hook para reader gerenciar solicitação:
  - `request`, `isLoading`, `isSubmitting`, `error`
  - `requestWriter()` — Envia solicitação
  - `refresh()` — Recarrega estado

### 9.7 Componente — RequestWriterButton

- [x] **9.7.1** `RequestWriterButton/` — Botão "Quero ser escritor" / estado pendente:
  - Se reader sem solicitação → mostra botão
  - Se solicitação pendente → mostra badge "Aguardando aprovação"
  - Se writer → não mostra nada
  - Se admin → não mostra nada

### 9.8 Página Admin — WriterRequestsPage

- [x] **9.8.1** `WriterRequestsPage/` — Gerenciamento de solicitações:
  - Filtros: Todos, Pendentes, Aprovados, Rejeitados
  - Tabela: Usuário, Email, Status, Solicitado em, Ações
  - Ações: Aprovar / Rejeitar (apenas pendentes)
  - Badge de pendentes no header
  - Estados: Loading, Empty, Erro com retry

### 9.9 Rotas

- [x] **9.9.1** `App.tsx` — Rota `/admin/solicitacoes-writer` protegida com `requireAdmin`
- [x] **9.9.2** `ProtectedRoute` — Suporte a `requireAdmin` e `requireWriter`

### 9.10 AuthContext — isWriter

- [x] **9.10.1** `AuthContextDefinition.ts` — Adicionar `isWriter: boolean`
- [x] **9.10.2** `AuthContext.tsx` — Resolver `isWriter` via `getIdTokenResult`

---

## ⚡ Sprint 10 — Cache por IP & Performance

**Objetivo:** Otimizar performance com cache por IP, lazy loading e code splitting.

### 10.1 Cache por IP

- [x] **10.1.1** `IPCacheAdapter` integrado nos use cases de leitura (`GetArticlesUseCase`, `GetArticleBySlugUseCase`)
- [x] **10.1.2** Invalidação de cache ao criar/editar/deletar artigo (`UpdateArticleUseCase`, `DeleteArticleUseCase`)
- [x] **10.1.3** `CacheIndicator` nas páginas públicas (Home, Artigo)
- [x] **10.1.4** `IPFetcher` como função pura `getIPHash()`, executada no `createContainer()`
- [x] **10.1.5** `useCachedFetch.ts` — Hook genérico de cache com TTL configurável

### 10.2 Performance

- [ ] **10.2.1** Lazy loading de páginas com `React.lazy()` + `Suspense`
- [ ] **10.2.2** Code splitting por rota (Admin vs Público)
- [ ] **10.2.3** Otimizar imagens (lazy loading, width/height, WebP)
- [ ] **10.2.4** Adicionar `React.memo()` em componentes pesados (ArticleCard, ArticleList, MarkdownRenderer)
- [ ] **10.2.5** Configurar Vite para produção (minificação, tree shaking, chunk splitting)
- [ ] **10.2.6** Adicionar `useMemo`/`useCallback` onde necessário

---

## 🧪 Sprint 11 — Testes

**Objetivo:** Garantir qualidade com testes unitários, de integração e E2E.

### 11.1 Configuração

- [ ] **11.1.1** Configurar Vitest no `vite.config.ts`
- [ ] **11.1.2** Configurar Testing Library
- [ ] **11.1.3** Configurar Playwright para E2E

### 11.2 Testes Unitários — Core

- [ ] **11.2.1** Testar `CreateArticleUseCase` — admin/writer pode criar, reader não, validação de campos
- [ ] **11.2.2** Testar `GetArticlesUseCase` — cache hit/miss
- [ ] **11.2.3** Testar `ToggleLikeUseCase` — logado/não logado, toggle funciona
- [ ] **11.2.4** Testar `RequestWriterUseCase` — reader solicita, admin/writer não, duplicata pendente
- [ ] **11.2.5** Testar `ApproveWriterUseCase` — admin aprova/rejeita, não-admin não
- [ ] **11.2.6** Testar entidades — `isCacheValid()` com TTL válido/expirado
- [ ] **11.2.7** Testar utilitários — `slugify()`, `dateFormat()`, `validators`

### 11.3 Testes de Componentes

- [ ] **11.3.1** Testar `Button` — Renderização, clique, loading, disabled
- [ ] **11.3.2** Testar `ArticleCard` — Renderização com dados mockados
- [ ] **11.3.3** Testar `AuthButton` — Estado logado, não logado, loading
- [ ] **11.3.4** Testar `LikeButton` — Voto, toggle, desabilitado sem login
- [ ] **11.3.5** Testar `RequestWriterButton` — Reader vê botão, writer/admin não, pendente mostra badge
- [ ] **11.3.6** Testar `ProtectedRoute` — Redireciona não-auth, bloqueia não-admin, bloqueia não-writer

### 11.4 Testes de Integração

- [ ] **11.4.1** Testar `AuthContext` + `useAuth` — Login, logout, `isAdmin`, `isWriter`
- [ ] **11.4.2** Testar `useLike` — Fluxo de like/dislike com adapter mockado
- [ ] **11.4.3** Testar `useWriterRequest` — Solicitar, estado pendente, refresh

### 11.5 Testes E2E (Playwright)

- [ ] **11.5.1** Testar fluxo de leitura — Home → clicar artigo → ver conteúdo → voltar
- [ ] **11.5.2** Testar fluxo de login — Clicar "Entrar com Google"
- [ ] **11.5.3** Testar fluxo admin — Login → criar artigo → publicar → ver na home
- [ ] **11.5.4** Testar fluxo writer request — Reader solicita → admin aprova → writer acessa painel
- [ ] **11.5.5** Testar fluxo de like — Login → like → dislike → remover

---

## 🚀 Sprint 12 — Polimento & Deploy

**Objetivo:** Finalizar detalhes, configurar deploy e documentar.

### 12.1 Polimento

- [ ] **12.1.1** Revisar responsividade mobile (320px, 768px, 1024px, 1440px)
- [ ] **12.1.2** Adicionar animações e transições (fade in artigos, transição like, loading skeleton)
- [ ] **12.1.3** Adicionar meta tags SEO (título, descrição, Open Graph, Twitter Card)
- [ ] **12.1.4** Adicionar/manter favicon (`public/favicon.svg`)
- [ ] **12.1.5** Tratar erros de rede (toast notifications via `ErrorBoundary`)
- [ ] **12.1.6** Revisar loading states em todas as páginas e botões
- [ ] **12.1.7** Adicionar página de perfil para o usuário (mostrar role, opção de solicitar writer)
- [ ] **12.1.8** Writer ver apenas seus próprios artigos no Dashboard (filtrar por `authorId`)

### 12.2 Firebase

- [ ] **12.2.1** Criar/verificar projeto no Firebase Console
- [ ] **12.2.2** Configurar Authentication (Google provider)
- [ ] **12.2.3** Configurar Firestore (criar índices compostos se necessário)
- [ ] **12.2.4** Configurar Storage (para imagens de capa)
- [ ] **12.2.5** Aplicar Security Rules:
  - Artigos: leitura pública de `published`, criação por admin/writer, edição por autor ou admin
  - Likes: leitura/escrita autenticada
  - WriterRequests: criação por reader, leitura por admin e próprio usuário, update por admin
- [ ] **12.2.6** Definir admin via `scripts/set-admin.js` ou Firebase Console

### 12.3 Deploy

- [ ] **12.3.1** Configurar Firebase Hosting (`firebase init hosting`)
- [ ] **12.3.2** Configurar build de produção (`npm run build`)
- [ ] **12.3.3** Fazer deploy (`firebase deploy`)
- [ ] **12.3.4** Configurar domínio personalizado (opcional)
- [ ] **12.3.5** Testar em produção (todas as rotas, fluxos principais)

### 12.4 Documentação

- [ ] **12.4.1** Atualizar `README.md` — Descrição, stack, como rodar, scripts disponíveis
- [ ] **12.4.2** Documentar variáveis de ambiente no `.env.example`
- [ ] **12.4.3** Documentar scripts úteis (`set-admin.js`, `set-role.js`)
- [ ] **12.4.4** Manter `LAYOUT.md` e `ARCHITECTURE2.md` atualizados

---

## 📊 Resumo de Progresso

```
Sprint 0  [##########] Setup do Projeto                      ✅
Sprint 1  [##########] Core — Regras de Negócio              ✅
Sprint 2  [##########] Adapters — Firebase & Cache           ✅
Sprint 3  [##########] DI Container & Contextos (v2 async)   ✅
Sprint 4  [##########] Componentes de UI                     ✅
Sprint 5  [##########] Páginas Públicas                      ✅
Sprint 6  [##########] Autenticação & Autorização (3 roles)  ✅
Sprint 7  [##########] Sistema de Like/Dislike (API v2)      ✅
Sprint 8  [##########] Admin — CRUD de Artigos               ✅
Sprint 9  [##########] Sistema de Writer Requests (v2)       ✅
Sprint 10 [#####-----] Cache por IP & Performance            🟡
Sprint 11 [----------] Testes                                ⬜
Sprint 12 [----------] Polimento & Deploy                    ⬜
```

---

## 🎯 Checklist Rápido por Prioridade

### 🔥 Must Have (MVP)

- [x] Setup do projeto (Sprint 0)
- [x] Core entities + ports (Sprint 1)
- [x] Firebase adapters (Sprint 2)
- [x] DI Container assíncrono (Sprint 3)
- [x] Componentes UI básicos (Sprint 4)
- [x] HomePage + ArticlePage (Sprint 5)
- [x] Login com Google + roles (Sprint 6)
- [x] Like/Dislike (Sprint 7)
- [x] Admin CRUD + Writer Requests (Sprints 8-9)
- [ ] Deploy (Sprint 12)

### ⭐ Nice to Have

- [ ] Performance — Lazy loading, code splitting (Sprint 10)
- [ ] Testes — Unitários, integração, E2E (Sprint 11)
- [ ] Animações e transições (Sprint 12)
- [ ] SEO e meta tags (Sprint 12)
- [ ] Página de perfil do usuário (Sprint 12)

---

> **Gerado a partir de:** `.rulescline/ARCHITECTURE2.md`  
> **Última atualização:** 12/07/2026  
> **Versão do TODO:** 2.0 (alinhado com ARCHITECTURE2.md)