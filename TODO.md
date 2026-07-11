# 📋 Blog Lucas — TODO List por Sprints

> **Baseado na arquitetura:** `.rules/ARCHITECTURE.md`  
> **Stack:** React 18+ · TypeScript 5+ · Vite 5+ · Firebase 10+ · Tailwind CSS 3+  
> **Tema:** Dracula Dark (azul escuro profundo)

---

## 🗺️ Visão Geral das Sprints

| Sprint | Foco | Duração Estimada |
|---|---|---|
| **Sprint 0** | Setup do Projeto | 1 dia |
| **Sprint 1** | Core — Regras de Negócio | 2 dias |
| **Sprint 2** | Adapters — Firebase & Cache | 2 dias |
| **Sprint 3** | DI Container & Contextos | 1 dia |
| **Sprint 4** | Componentes de UI | 2 dias |
| **Sprint 5** | Páginas Públicas | 2 dias |
| **Sprint 6** | Autenticação & Autorização | 2 dias |
| **Sprint 7** | Sistema de Like/Dislike | 1 dia |
| **Sprint 8** | Admin — CRUD de Artigos | 2 dias |
| **Sprint 9** | Cache por IP & Performance | 1 dia |
| **Sprint 10** | Testes | 2 dias |
| **Sprint 11** | Polimento & Deploy | 2 dias |

**Total estimado:** ~20 dias

---

## 🏁 Sprint 0 — Setup do Projeto

**Objetivo:** Inicializar o projeto com Vite + React + TypeScript, configurar ferramentas e dependências.

### Tarefas

- [x] **0.1** Criar projeto com Vite
  ```bash
  npm create vite@latest . -- --template react-ts
  ```
- [x] **0.2** Instalar dependências principais
  ```bash
  npm install firebase react-router-dom react-markdown uuid
  npm install -D tailwindcss @tailwindcss/typography @tailwindcss/line-clamp postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom @playwright/test
  ```
- [x] **0.3** Configurar Tailwind CSS
  - Criar `tailwind.config.ts` com cores Dracula Dark
  - Criar `postcss.config.js`
  - Adicionar diretivas Tailwind no `index.css`
- [x] **0.4** Configurar TypeScript strict mode no `tsconfig.json`
- [x] **0.5** Configurar ESLint + Prettier
- [x] **0.6** Configurar variáveis de ambiente (`.env.example`)
  ```env
  VITE_FIREBASE_API_KEY=
  VITE_FIREBASE_AUTH_DOMAIN=
  VITE_FIREBASE_PROJECT_ID=
  VITE_FIREBASE_STORAGE_BUCKET=
  VITE_FIREBASE_MESSAGING_SENDER_ID=
  VITE_FIREBASE_APP_ID=
  ```
- [x] **0.7** Criar estrutura de diretórios vazia
  ```
  src/core/entities/
  src/core/ports/
  src/core/use-cases/articles/
  src/core/use-cases/auth/
  src/core/use-cases/likes/
  src/core/errors/
  src/adapters/firebase/
  src/adapters/cache/
  src/adapters/http/
  src/di/
  src/presentation/components/ui/
  src/presentation/components/article/
  src/presentation/components/auth/
  src/presentation/components/likes/
  src/presentation/hooks/
  src/presentation/contexts/
  src/presentation/layouts/
  src/presentation/pages/admin/
  src/shared/types/
  src/shared/utils/
  src/shared/constants/
  ```
- [x] **0.8** Configurar `vite.config.ts` com path aliases (`@/` → `src/`)
- [x] **0.9** Verificar que `npm run dev` funciona (tela em branco)

---

## 🧠 Sprint 1 — Core: Regras de Negócio

**Objetivo:** Implementar toda a camada core (entidades, ports, use cases, erros) sem dependência de bibliotecas externas.

### 1.1 Entidades

- [x] **1.1.1** Criar `src/core/entities/Article.ts`
  - Interface `Article`, `CreateArticleDTO`, `UpdateArticleDTO`, tipo `ArticleStatus`
- [x] **1.1.2** Criar `src/core/entities/User.ts`
  - Interface `AppUser`, `AuthState`, tipo `UserRole`
- [x] **1.1.3** Criar `src/core/entities/LikeDislike.ts`
  - Interface `LikeDislike`, `ArticleLikesSummary`, tipo `LikeType`
- [x] **1.1.4** Criar `src/core/entities/CacheEntry.ts`
  - Interface `CacheEntry<T>`, função `isCacheValid()`

### 1.2 Ports (Interfaces)

- [x] **1.2.1** Criar `src/core/ports/ArticleRepositoryPort.ts`
- [x] **1.2.2** Criar `src/core/ports/AuthRepositoryPort.ts`
- [x] **1.2.3** Criar `src/core/ports/LikeRepositoryPort.ts`
- [x] **1.2.4** Criar `src/core/ports/CachePort.ts`

### 1.3 Erros de Domínio

- [x] **1.3.1** Criar `src/core/errors/DomainError.ts`
- [x] **1.3.2** Criar `src/core/errors/UnauthorizedError.ts`
- [x] **1.3.3** Criar `src/core/errors/ValidationError.ts`

### 1.4 Use Cases — Articles

- [x] **1.4.1** Criar `src/core/use-cases/articles/CreateArticleUseCase.ts`
  - Validar admin, validar campos, gerar slug, chamar repositório
- [x] **1.4.2** Criar `src/core/use-cases/articles/GetArticlesUseCase.ts`
  - Buscar artigos publicados com cache
- [x] **1.4.3** Criar `src/core/use-cases/articles/GetArticleBySlugUseCase.ts`
  - Buscar artigo por slug com cache
- [x] **1.4.4** Criar `src/core/use-cases/articles/UpdateArticleUseCase.ts`
  - Validar admin, atualizar artigo
- [x] **1.4.5** Criar `src/core/use-cases/articles/DeleteArticleUseCase.ts`
  - Validar admin, deletar artigo, invalidar cache

### 1.5 Use Cases — Auth

- [x] **1.5.1** Criar `src/core/use-cases/auth/LoginUseCase.ts`
- [x] **1.5.2** Criar `src/core/use-cases/auth/LogoutUseCase.ts`
- [x] **1.5.3** Criar `src/core/use-cases/auth/GetCurrentUserUseCase.ts`

### 1.6 Use Cases — Likes

- [x] **1.6.1** Criar `src/core/use-cases/likes/ToggleLikeUseCase.ts`
  - Validar login, alternar like/dislike
- [x] **1.6.2** Criar `src/core/use-cases/likes/GetArticleLikesUseCase.ts`
  - Obter resumo de avaliações de um artigo

### 1.7 Shared — Utilitários

- [x] **1.7.1** Criar `src/shared/utils/slugify.ts`
  - Função para converter título em slug
- [x] **1.7.2** Criar `src/shared/utils/dateFormat.ts`
  - Funções de formatação de data (pt-BR)
- [x] **1.7.3** Criar `src/shared/utils/validators.ts`
  - Validadores de campos (título, conteúdo, etc.)
- [x] **1.7.4** Criar `src/shared/constants/cache.ts`
  - Constantes de TTL para cache
- [x] **1.7.5** Criar `src/shared/constants/roles.ts`
  - Constantes de roles de usuário
- [x] **1.7.6** Criar `src/shared/types/api.ts`
  - Tipos de resposta padronizados
- [x] **1.7.7** Criar `src/shared/types/common.ts`
  - Tipos utilitários genéricos

---

## 🔌 Sprint 2 — Adapters: Firebase & Cache

**Objetivo:** Implementar os adapters que conectam o core às bibliotecas externas (Firebase, localStorage, ipify).

### 2.1 Firebase Config

- [x] **2.1.1** Criar `src/adapters/firebase/firebaseConfig.ts`
  - Inicializar Firebase com variáveis de ambiente
  - Exportar `getFirebaseAuth()`, `getFirebaseDb()`, `getFirebaseStorage()`

### 2.2 FirebaseArticleAdapter

- [x] **2.2.1** Criar `src/adapters/firebase/FirebaseArticleAdapter.ts`
  - Implementar `ArticleRepositoryPort`
  - Métodos: `getAll`, `getById`, `getBySlug`, `create`, `update`, `delete`, `getByAuthor`
  - Mapear Timestamp do Firestore para Date

### 2.3 FirebaseAuthAdapter

- [x] **2.3.1** Criar `src/adapters/firebase/FirebaseAuthAdapter.ts`
  - Implementar `AuthRepositoryPort`
  - Login com Google (popup)
  - Logout
  - `onAuthStateChanged` com callback
  - Verificação de admin via custom claims (`getIdTokenResult`)

### 2.4 FirebaseLikeAdapter

- [x] **2.4.1** Criar `src/adapters/firebase/FirebaseLikeAdapter.ts`
  - Implementar `LikeRepositoryPort`
  - Lógica de toggle (none → like → dislike → none)
  - Atualização atômica com `increment()`

### 2.5 Cache & HTTP

- [x] **2.5.1** Criar `src/adapters/http/IPFetcher.ts`
  - Obter IP público via api.ipify.org
  - Gerar hash do IP (função hash simples)
  - Fallback para `local-dev` em caso de erro
- [x] **2.5.2** Criar `src/adapters/cache/IPCacheAdapter.ts`
  - Implementar `CachePort`
  - Armazenamento em `localStorage`
  - Chave composta: `{prefix}_{key}_{ip_hash}`
  - Validação de TTL
  - Invalidação por prefixo

---

## 💉 Sprint 3 — DI Container & Contextos

**Objetivo:** Configurar a injeção de dependência e os contextos React.

### 3.1 DI Container

- [x] **3.1.1** Criar `src/di/types.ts`
  - Tipo `Container` baseado no `typeof container`
- [x] **3.1.2** Criar `src/di/container.ts`
  - Instanciar todos os adapters (singleton)
  - Instanciar todos os use cases com suas dependências
  - Exportar objeto `container` com tipo `as const`

### 3.2 Contextos React

- [x] **3.2.1** Criar `src/presentation/contexts/DIContext.tsx`
  - `DIProvider` com o container
  - Hook `useDI()` com validação
- [x] **3.2.2** Criar `src/presentation/contexts/AuthContext.tsx`
  - `AuthProvider` com estado de autenticação
  - Escutar `onAuthStateChanged`
  - Hook `useAuth()` (ou usar o hook separado)

---

## 🎨 Sprint 4 — Componentes de UI

**Objetivo:** Criar todos os componentes reutilizáveis de UI com estilo Dracula Dark.

### 4.1 Componentes Base

- [ ] **4.1.1** Criar `Button` (index.tsx + styles.ts)
  - Variantes: primary, secondary, danger, ghost
  - Tamanhos: sm, md, lg
  - Estado de loading com spinner
- [ ] **4.1.2** Criar `Input` (index.tsx + styles.ts)
  - Label, mensagem de erro, placeholder
- [ ] **4.1.3** Criar `TextArea` (index.tsx + styles.ts)
  - Label, mensagem de erro, rows configurável
- [ ] **4.1.4** Criar `LoadingSpinner` (index.tsx + styles.ts)
  - Tamanhos configuráveis
- [ ] **4.1.5** Criar `ErrorMessage` (index.tsx + styles.ts)
  - Mensagem de erro com opção de retry
- [ ] **4.1.6** Criar `CacheIndicator` (index.tsx + styles.ts)
  - Badge "Dados em cache • Xmin atrás"
- [ ] **4.1.7** Criar `Modal` (index.tsx + styles.ts)
  - Overlay, título, conteúdo, botão fechar
- [ ] **4.1.8** Criar `ConfirmDialog` (index.tsx + styles.ts)
  - Mensagem, confirmar, cancelar
- [ ] **4.1.9** Criar `ErrorBoundary` (index.tsx)
  - Componente de classe para capturar erros

### 4.2 Tema Dracula Dark

- [ ] **4.2.1** Definir paleta de cores Dracula no `tailwind.config.ts`
  ```ts
  colors: {
    dracula: {
      bg: '#282a36',      // Fundo principal
      current: '#44475a',  // Linha atual / seleção
      fg: '#f8f8f2',      // Texto principal
      comment: '#6272a4',  // Comentários
      cyan: '#8be9fd',
      green: '#50fa7b',
      orange: '#ffb86c',
      pink: '#ff79c6',
      purple: '#bd93f9',
      red: '#ff5555',
      yellow: '#f1fa8c',
    }
  }
  ```
- [ ] **4.2.2** Criar `index.css` com estilos globais Dracula
  - Background escuro, texto claro
  - Scrollbar estilizada
  - Seleção de texto com cor Dracula

---

## 📄 Sprint 5 — Páginas Públicas

**Objetivo:** Implementar as páginas públicas do blog (Home, Artigo, Login, 404).

### 5.1 Layout Principal

- [ ] **5.1.1** Criar `MainLayout` (index.tsx + styles.ts)
  - Header com logo, navegação, AuthButton
  - Main content area
  - Footer
  - Estilo Dracula Dark

### 5.2 Hooks

- [ ] **5.2.1** Criar `src/presentation/hooks/useArticles.ts`
  - Hook para listar artigos com cache
- [ ] **5.2.2** Criar `src/presentation/hooks/useArticle.ts`
  - Hook para buscar artigo por slug com cache
- [ ] **5.2.3** Criar `src/presentation/hooks/useCachedFetch.ts`
  - Hook genérico de cache (já implementado na arquitetura)
- [ ] **5.2.4** Criar `src/presentation/hooks/useInjection.ts`
  - Hook para acessar o container DI (wrapper do useDI)

### 5.3 Componentes de Artigo

- [ ] **5.3.1** Criar `ArticleCard` (index.tsx + styles.ts)
  - Card com imagem, tags, título, excerpt, autor, data
  - Link para página do artigo
- [ ] **5.3.2** Criar `ArticleList` (index.tsx + styles.ts)
  - Grid de ArticleCards
  - Estados: loading, empty, error
- [ ] **5.3.3** Criar `ArticleContent` (index.tsx + styles.ts)
  - Layout de artigo completo (título, autor, data, conteúdo)
- [ ] **5.3.4** Criar `MarkdownRenderer` (index.tsx + styles.ts)
  - Renderizar Markdown com `react-markdown`
  - Estilo Dracula para código, headings, links

### 5.4 Páginas

- [ ] **5.4.1** Criar `HomePage` (index.tsx + styles.ts)
  - Hero section com título e subtítulo
  - Grid de artigos com cache de 5min
  - Loading skeleton
  - Empty state
- [ ] **5.4.2** Criar `ArticlePage` (index.tsx + styles.ts)
  - Carregar artigo por slug com cache de 10min
  - Renderizar ArticleContent + MarkdownRenderer
  - LikeButton (se usuário logado)
  - CacheIndicator
- [ ] **5.4.3** Criar `LoginPage` (index.tsx + styles.ts)
  - Botão "Entrar com Google"
  - Redirecionar se já logado
- [ ] **5.4.4** Criar `NotFoundPage` (index.tsx + styles.ts)
  - Mensagem 404 com link para home

---

## 🔐 Sprint 6 — Autenticação & Autorização

**Objetivo:** Implementar login com Google, gerenciamento de sessão e proteção de rotas.

### 6.1 Componentes de Auth

- [ ] **6.1.1** Criar `UserAvatar` (index.tsx + styles.ts)
  - Foto do usuário ou iniciais
  - Tooltip com nome e email
- [ ] **6.1.2** Criar `AuthButton` (index.tsx + styles.ts)
  - Estado não logado: botão "Entrar com Google"
  - Estado logado: avatar + nome + botão "Sair"
  - Estado loading: botão desabilitado
- [ ] **6.1.3** Criar `ProtectedRoute` (index.tsx + styles.ts)
  - Verificar autenticação
  - Verificar role (admin)
  - Redirecionar para login se não autenticado
  - Redirecionar para home se não for admin

### 6.2 Hook de Auth

- [ ] **6.2.1** Criar `src/presentation/hooks/useAuth.ts`
  - Hook que consome AuthContext + DI
  - `user`, `isLoading`, `login()`, `logout()`, `isAdmin`

### 6.3 Firebase Custom Claims

- [ ] **6.3.1** Criar script `scripts/set-admin.js`
  - Script Node.js para definir admin via Firebase Admin SDK
  - ```bash
    node scripts/set-admin.js uid-do-usuario
    ```

---

## 👍 Sprint 7 — Sistema de Like/Dislike

**Objetivo:** Implementar avaliação de artigos com like/dislike.

### 7.1 Componentes de Like

- [ ] **7.1.1** Criar `LikeButton` (index.tsx + styles.ts)
  - Botões de like/dislike com ícones SVG
  - Estado ativo/inativo com cores Dracula
  - Contador de votos
  - Desabilitado se não logado
- [ ] **7.1.2** Criar `LikeCounter` (index.tsx + styles.ts)
  - Exibir total de likes e dislikes
  - Barra de proporção visual

### 7.2 Hook de Like

- [ ] **7.2.1** Criar `src/presentation/hooks/useLike.ts`
  - Carregar resumo de avaliações
  - Alternar voto (like/dislike/none)
  - Estado de loading

---

## ✏️ Sprint 8 — Admin: CRUD de Artigos

**Objetivo:** Implementar o painel administrativo para gerenciar artigos.

### 8.1 Layout Admin

- [ ] **8.1.1** Criar `AdminLayout` (index.tsx + styles.ts)
  - Sidebar com navegação admin
  - Header com info do admin
  - Main content area

### 8.2 Componentes de Formulário

- [ ] **8.2.1** Criar `ArticleForm` (index.tsx + styles.ts)
  - Campos: título, conteúdo (Markdown), excerpt, tags, coverImage, status
  - Preview de Markdown ao vivo
  - Validação de campos
  - Estado de submissão (loading)

### 8.3 Páginas Admin

- [ ] **8.3.1** Criar `DashboardPage` (index.tsx + styles.ts)
  - Lista de artigos (publicados e rascunhos)
  - Ações: editar, deletar, publicar/despublicar
  - Estatísticas: total de artigos, total de likes
- [ ] **8.3.2** Criar `NewArticlePage` (index.tsx + styles.ts)
  - Formulário para criar novo artigo
  - Redirecionar após criação
- [ ] **8.3.3** Criar `EditArticlePage` (index.tsx + styles.ts)
  - Carregar artigo existente
  - Formulário pré-preenchido
  - Salvar alterações

---

## ⚡ Sprint 9 — Cache por IP & Performance

**Objetivo:** Otimizar performance com cache por IP e boas práticas.

### 9.1 Cache

- [ ] **9.1.1** Integrar `IPCacheAdapter` nos use cases de leitura
  - `GetArticlesUseCase` com cache de 5min
  - `GetArticleBySlugUseCase` com cache de 10min
- [ ] **9.1.2** Implementar invalidação de cache
  - Ao criar/editar/deletar artigo, invalidar cache de listagem
- [ ] **9.1.3** Adicionar `CacheIndicator` nas páginas públicas
  - Mostrar "Dados em cache • Xmin atrás"

### 9.2 Performance

- [ ] **9.2.1** Lazy loading de páginas com `React.lazy()` + `Suspense`
- [ ] **9.2.2** Code splitting por rota
- [ ] **9.2.3** Otimizar imagens (lazy loading, width/height)
- [ ] **9.2.4** Adicionar `React.memo()` em componentes pesados
- [ ] **9.2.5** Configurar Vite para produção (minificação, tree shaking)

---

## 🧪 Sprint 10 — Testes

**Objetivo:** Garantir qualidade com testes unitários, de integração e E2E.

### 10.1 Configuração

- [ ] **10.1.1** Configurar Vitest no `vite.config.ts`
- [ ] **10.1.2** Configurar Testing Library
- [ ] **10.1.3** Configurar Playwright para E2E

### 10.2 Testes Unitários — Core

- [ ] **10.2.1** Testar `CreateArticleUseCase`
  - Admin pode criar
  - Não-admin não pode criar
  - Validação de campos obrigatórios
- [ ] **10.2.2** Testar `GetArticlesUseCase`
  - Cache hit retorna dados do cache
  - Cache miss busca do Firestore
- [ ] **10.2.3** Testar `ToggleLikeUseCase`
  - Usuário logado pode votar
  - Usuário não logado não pode
  - Toggle funciona (like → none, like → dislike)
- [ ] **10.2.4** Testar entidades
  - `isCacheValid()` com TTL válido e expirado
- [ ] **10.2.5** Testar utilitários
  - `slugify()` com títulos especiais
  - `dateFormat()` com datas

### 10.3 Testes de Componentes

- [ ] **10.3.1** Testar `Button`
  - Renderização, clique, loading, disabled
- [ ] **10.3.2** Testar `ArticleCard`
  - Renderização com dados mockados
- [ ] **10.3.3** Testar `AuthButton`
  - Estado logado, não logado, loading
- [ ] **10.3.4** Testar `LikeButton`
  - Voto, toggle, desabilitado sem login

### 10.4 Testes de Integração

- [ ] **10.4.1** Testar `AuthContext` + `useAuth`
  - Login, logout, estado inicial
- [ ] **10.4.2** Testar fluxo de like
  - Hook `useLike` com adapter mockado

### 10.5 Testes E2E (Playwright)

- [ ] **10.5.1** Testar fluxo completo de leitura
  - Home → clicar artigo → ver conteúdo
- [ ] **10.5.2** Testar fluxo de login
  - Clicar "Entrar com Google" → redirecionar
- [ ] **10.5.3** Testar fluxo admin
  - Login → criar artigo → publicar → ver na home

---

## 🚀 Sprint 11 — Polimento & Deploy

**Objetivo:** Finalizar detalhes, configurar deploy e documentar.

### 11.1 Polimento

- [ ] **11.1.1** Revisar responsividade mobile
  - Testar em 320px, 768px, 1024px, 1440px
- [ ] **11.1.2** Adicionar animações e transições
  - Fade in de artigos
  - Transição de like
  - Loading skeleton
- [ ] **11.1.3** Adicionar meta tags SEO
  - Título, descrição, Open Graph
- [ ] **11.1.4** Adicionar favicon
- [ ] **11.1.5** Tratar erros de rede (toast notifications)
- [ ] **11.1.6** Adicionar loading states em todas as páginas

### 11.2 Firebase

- [ ] **11.2.1** Criar projeto no Firebase Console
- [ ] **11.2.2** Configurar Authentication (Google provider)
- [ ] **11.2.3** Configurar Firestore (criar índices se necessário)
- [ ] **11.2.4** Configurar Storage (para imagens)
- [ ] **11.2.5** Aplicar Security Rules (Firestore + Storage)
- [ ] **11.2.6** Definir admin via Firebase Console ou Admin SDK

### 11.3 Deploy

- [ ] **11.3.1** Configurar Firebase Hosting
  ```bash
  npm install -g firebase-tools
  firebase init hosting
  ```
- [ ] **11.3.2** Configurar build de produção
  ```bash
  npm run build
  ```
- [ ] **11.3.3** Fazer deploy
  ```bash
  firebase deploy
  ```
- [ ] **11.3.4** Configurar domínio personalizado (opcional)
- [ ] **11.3.5** Testar em produção

### 11.4 Documentação

- [ ] **11.4.1** Atualizar `README.md`
  - Descrição do projeto
  - Como rodar localmente
  - Link para demo
- [ ] **11.4.2** Documentar variáveis de ambiente
- [ ] **11.4.3** Documentar comandos úteis

---

## 📊 Resumo de Progresso

```
Sprint 0  [##########] Setup do Projeto ✅
Sprint 1  [##########] Core — Regras de Negócio ✅

Sprint 2  [##########] Adapters — Firebase & Cache ✅
Sprint 3  [##########] DI Container & Contextos ✅
Sprint 4  [          ] Componentes de UI
Sprint 5  [          ] Páginas Públicas
Sprint 6  [          ] Autenticação & Autorização
Sprint 7  [          ] Sistema de Like/Dislike
Sprint 8  [          ] Admin — CRUD de Artigos
Sprint 9  [          ] Cache por IP & Performance
Sprint 10 [          ] Testes
Sprint 11 [          ] Polimento & Deploy
```

> **Total de tarefas:** ~110 tarefas  
> **Duração estimada:** ~20 dias  
> **Status:** 🟢 Sprint 0 concluída | 🟢 Sprint 1 concluída | 🟢 Sprint 2 concluída | 🟢 Sprint 3 concluída


---

## 🎯 Checklist Rápido por Prioridade

### 🔥 Must Have (MVP)

- [x] Setup do projeto (Sprint 0)
- [x] Core entities + ports (Sprint 1)
- [x] Firebase adapters (Sprint 2)
- [x] DI Container (Sprint 3)
- [ ] Componentes UI básicos (Sprint 4)
- [ ] HomePage + ArticlePage (Sprint 5)
- [ ] Login com Google (Sprint 6)
- [ ] CRUD de artigos admin (Sprint 8)
- [ ] Deploy (Sprint 11)

### ⭐ Nice to Have

- [ ] Like/Dislike (Sprint 7)
- [ ] Cache por IP (Sprint 9)
- [ ] Testes (Sprint 10)
- [ ] Animações (Sprint 11)
- [ ] SEO (Sprint 11)

---

> **Gerado a partir de:** `.rules/ARCHITECTURE.md`  
> **Última atualização:** 10/07/2026
