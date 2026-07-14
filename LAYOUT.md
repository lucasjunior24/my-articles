# 📐 Documentação do Layout e Navegação — My Articles

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Estrutura de Rotas](#-estrutura-de-rotas)
3. [Layouts](#-layouts)
   - [MainLayout (Público)](#mainlayout-público)
   - [AdminLayout (Administrativo)](#adminlayout-administrativo)
4. [Páginas](#-páginas)
   - [HomePage](#homepage)
   - [ArticlePage](#articlepage)
   - [LoginPage](#loginpage)
   - [NotFoundPage (404)](#notfoundpage-404)
   - [DashboardPage (Admin)](#dashboardpage-admin)
   - [NewArticlePage (Admin)](#newarticlepage-admin)
   - [EditArticlePage (Admin)](#editarticlepage-admin)
5. [Componentes Compartilhados](#-componentes-compartilhados)
6. [Tema e Estilo](#-tema-e-estilo)
7. [Autenticação e Controle de Acesso](#-autenticação-e-controle-de-acesso)
8. [Mapa de Navegação](#-mapa-de-navegação)

---

## 🎯 Visão Geral

O **My Articles** é uma aplicação React + TypeScript com Firebase, utilizando **Tailwind CSS v4** com tema **Dracula Dark**. A aplicação possui duas áreas principais:

- **Área Pública** — Qualquer visitante pode acessar
- **Área Administrativa** — Restrita a usuários com role `admin`

### Stack principal

| Tecnologia | Versão | Função |
|---|---|---|
| React | ^19.2.7 | UI Library |
| TypeScript | ~6.0.2 | Linguagem |
| Vite | ^8.1.1 | Build tool |
| React Router | ^7.18.1 | Roteamento SPA |
| Tailwind CSS | ^4.3.2 | Estilização utilitária |
| Firebase | ^12.16.0 | Backend (Auth + Firestore) |
| react-markdown | ^10.1.0 | Renderização de Markdown |

---

## 🗺️ Estrutura de Rotas

Todas as rotas são definidas em `src/App.tsx` usando `react-router-dom` v7.

```
src/App.tsx
├── <BrowserRouter>
│   ├── <MainLayout>              ← Layout público (header + footer)
│   │   ├── /                     → HomePage
│   │   ├── /artigo/:slug         → ArticlePage
│   │   ├── /login                → LoginPage
│   │   └── *                     → NotFoundPage (404)
│   │
│   └── <ProtectedRoute requireAdmin>
│       └── <AdminLayout>         ← Layout admin (sidebar + header)
│           ├── /admin            → DashboardPage
│           ├── /admin/artigos/novo    → NewArticlePage
│           └── /admin/artigos/editar/:id → EditArticlePage
```

### Providers (em `src/main.tsx`)

```
<StrictMode>
  <DIProvider>          ← Injeção de dependência (Firebase, casos de uso)
    <AuthProvider>      ← Estado de autenticação global
      <App />           ← Rotas e layouts
    </AuthProvider>
  </DIProvider>
</StrictMode>
```

---

## 🧱 Layouts

### MainLayout (Público)

**Arquivo:** `src/presentation/layouts/MainLayout/index.tsx`

Layout principal do blog, usado por todas as páginas públicas.

```
┌──────────────────────────────────────────────────────┐
│  HEADER (sticky, backdrop-blur-lg, shadow-sm)         │
│  ┌────────────────────────────────────────────────┐   │
│  │ [📖 My Articles]  🏠 Home  🛡️ Admin?  [🔐 Auth]│   │
│  │                  (com ícones SVG)               │   │
│  └────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────┤
│                                                        │
│  MAIN CONTENT (Outlet)                                 │
│  ┌────────────────────────────────────────────────┐   │
│  │                                                │   │
│  │   Página renderizada pelo React Router         │   │
│  │   (max-w-7xl mx-auto, py-6 md:py-10)           │   │
│  │                                                │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
├──────────────────────────────────────────────────────┤
│  FOOTER                                                │
│  ┌────────────────────────────────────────────────┐   │
│  │ 📖 My Articles © 2026    ● React + TypeScript   │   │
│  │                          ● Tema Dracula Dark    │   │
│  └────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

**Características:**
- **Header sticky** com backdrop blur, sombra suave e borda sutil
- **Logo** "My Articles" com ícone de livro em container arredondado, link para `/`
- **Nav** com links "Home" (`/`) e "Painel Admin" (`/admin` — visível apenas para admins), ambos com **ícones SVG** e destaque visual no link ativo (bg rosa)
- **AuthButton** — botão de login com Google (rosa, arredondado, com sombra) ou avatar + nome + "Sair" (vermelho)
- **Footer** com copyright e informações da stack com indicadores coloridos
- **Responsivo:** Nav fica visível apenas em `md:` (768px+)

---

### AdminLayout (Administrativo)

**Arquivo:** `src/presentation/layouts/AdminLayout/index.tsx`

Layout do painel administrativo, protegido por `ProtectedRoute`.

```
┌──────────────────────────────────────────────────────┐
│  SIDEBAR (w-64, hidden em mobile)                    │
│  ┌──────────────┐  ┌──────────────────────────────┐  │
│  │ My Articles   │  │ HEADER (sticky)               │  │
│  │ Painel Admin │  │ ┌────────────────────────┐    │  │
│  │              │  │ │ [Admin] [Novo]  👤 Sair│    │  │
│  │ 📊 Dashboard │  │ └────────────────────────┘    │  │
│  │ ➕ Novo Art. │  │                              │  │
│  │              │  │ MAIN CONTENT (Outlet)         │  │
│  │ ← Voltar ao │  │ ┌────────────────────────┐    │  │
│  │   Blog      │  │ │                        │    │  │
│  └──────────────┘  │ │  Página admin atual   │    │  │
│                     │ │                        │    │  │
│                     │ └────────────────────────┘    │  │
│                     └──────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

**Características:**
- **Sidebar fixa** (w-64) com navegação admin:
  - "Dashboard" → `/admin`
  - "Novo Artigo" → `/admin/artigos/novo`
  - "Voltar ao Blog" → `/` (no final da sidebar)
- **Header sticky** com:
  - Navegação mobile (links simplificados)
  - **UserAvatar** com nome do admin
  - Botão "Sair" (vermelho)
- **Destaque visual** no item de nav ativo (bg `dracula-pink/10`)
- **Responsivo:** Sidebar visível apenas em `md:`, mobile usa nav horizontal no header

---

## 📄 Páginas

### HomePage

**Rota:** `/`
**Arquivo:** `src/presentation/pages/HomePage/index.tsx`

```
┌─────────────────────────────────────────────┐
│  HERO SECTION                               │
│  ┌─────────────────────────────────────┐    │
│  │   Blog do Lucas                     │    │
│  │   Artigos sobre desenvolvimento...  │    │
│  │   ● Últimos artigos                 │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ARTICLES GRID                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Article  │ │ Article  │ │ Article  │   │
│  │ Card     │ │ Card     │ │ Card     │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Article  │ │ Article  │ │ Article  │   │
│  │ Card     │ │ Card     │ │ Card     │   │
│  └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────────────────────────┘
```

**Estados:**
- **Loading:** 6 skeletons animados no grid
- **Error:** Componente `ErrorMessage` com botão "Tentar novamente"
- **Empty:** Mensagem "Nenhum artigo publicado ainda"
- **Sucesso:** Grid de `ArticleCard` (1 col mobile, 2 md, 3 lg)

**Cache:** Artigos são cacheados por 5 minutos (`useArticles`)

---

### ArticlePage

**Rota:** `/artigo/:slug`
**Arquivo:** `src/presentation/pages/ArticlePage/index.tsx`

```
┌─────────────────────────────────────────────┐
│  ARTICLE CONTENT (max-w-3xl mx-auto)        │
│  ┌─────────────────────────────────────┐    │
│  │  [React] [TypeScript] [Firebase]   │    │
│  │                                     │    │
│  │  Título do Artigo (h1)             │    │
│  │                                     │    │
│  │  👤 Autor • 15/07/2026             │    │
│  │                                     │    │
│  │  ┌─────────────────────────────┐    │    │
│  │  │     Imagem de Capa          │    │    │
│  │  └─────────────────────────────┘    │    │
│  │                                     │    │
│  │  Conteúdo Markdown Renderizado      │    │
│  │  - Headings coloridos               │    │
│  │  - Código com syntax highlight      │    │
│  │  - Links, listas, blockquotes       │    │
│  │                                     │    │
│  │  ─────────────────────────────      │    │
│  │  Publicado por Autor • N curtidas   │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

**Estados:**
- **Loading:** Spinner + texto "Carregando artigo..."
- **Error:** `ErrorMessage` com retry
- **Not Found:** Mensagem "Artigo não encontrado" + link "Voltar para Home"
- **Sucesso:** `ArticleContent` completo

**Cache:** Artigo é cacheado por 10 minutos (`useArticle`)

---

### LoginPage

**Rota:** `/login`
**Arquivo:** `src/presentation/pages/LoginPage/index.tsx`

```
┌─────────────────────────────────────────────┐
│  ┌─────────────────────────────────────┐    │
│  │         🔒                          │    │
│  │                                     │    │
│  │      Entrar no Blog                 │    │
│  │  Faça login para interagir...       │    │
│  │                                     │    │
│  │  ┌─────────────────────────────┐    │    │
│  │  │  G  Entrar com Google       │    │    │
│  │  └─────────────────────────────┘    │    │
│  │                                     │    │
│  │  Ao entrar, você concorda...        │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

**Comportamento:**
- Se usuário já estiver logado → redireciona para `/`
- Botão "Entrar com Google" estilizado com as cores do Google
- Loading state com spinner

---

### NotFoundPage (404)

**Rota:** `*` (qualquer rota não definida)
**Arquivo:** `src/presentation/pages/NotFoundPage/index.tsx`

```
┌─────────────────────────────────────────────┐
│              404                             │
│                                             │
│        Página não encontrada                │
│    A página que você está procurando...     │
│                                             │
│    [Voltar para Home]  [Voltar]             │
└─────────────────────────────────────────────┘
```

**Ações:**
- "Voltar para Home" → link para `/`
- "Voltar" → `window.history.back()`

---

### DashboardPage (Admin)

**Rota:** `/admin`
**Arquivo:** `src/presentation/pages/admin/DashboardPage/index.tsx`

```
┌─────────────────────────────────────────────┐
│  Dashboard                     [+ Novo Art.]│
│  Gerencie seus artigos                      │
│                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │Total │ │Publ. │ │Rasc. │ │Likes │      │
│  │  12  │ │   8  │ │   4  │ │  156 │      │
│  └──────┘ └──────┘ └──────┘ └──────┘      │
│                                             │
│  Todos os Artigos                           │
│  ┌─────────────────────────────────────┐    │
│  │ Título      Status   Data   Ações   │    │
│  ├─────────────────────────────────────┤    │
│  │ Meu Artigo  🟢 Pub  15/07  [🔁][✏️][🗑️]│    │
│  │ Rascunho    🟠 Draft 14/07  [🔁][✏️][🗑️]│    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

**Funcionalidades:**
- **Cards de estatísticas:** Total, Publicados, Rascunhos, Likes
- **Tabela de artigos** com colunas: Título, Status, Data, Ações
- **Ações por artigo:**
  - 🔁 Alternar status (publicar/despublicar)
  - ✏️ Editar → `/admin/artigos/editar/:id`
  - 🗑️ Excluir (com `ConfirmDialog` de confirmação)
- **Estado vazio:** Mensagem + link "Criar Primeiro Artigo"
- **Responsivo:** Status oculto em `<md`, Data oculto em `<lg`

---

### NewArticlePage (Admin)

**Rota:** `/admin/artigos/novo`
**Arquivo:** `src/presentation/pages/admin/NewArticlePage/index.tsx`

```
┌─────────────────────────────────────────────┐
│  Novo Artigo                                │
│  Crie um novo artigo para o blog            │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Título do Artigo [______________] │    │
│  │                                     │    │
│  │  Conteúdo (Markdown)  [Preview]     │    │
│  │  ┌─────────────────────────────┐    │    │
│  │  │ Editor Markdown             │    │    │
│  │  └─────────────────────────────┘    │    │
│  │                                     │    │
│  │  Resumo [______________________]    │    │
│  │  Tags [________________________]    │    │
│  │  URL da Capa [________________]     │    │
│  │                                     │    │
│  │  Status: ○ Rascunho  ● Publicado    │    │
│  │                                     │    │
│  │              [Cancelar] [Criar Art.]│    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

**Funcionalidades:**
- Formulário completo com validação
- Preview de Markdown ao vivo (alterna entre editor e preview)
- Campos: título, conteúdo, resumo, tags, imagem de capa, status
- Botão "Cancelar" volta para página anterior
- Redireciona para `/admin` após sucesso

---

### EditArticlePage (Admin)

**Rota:** `/admin/artigos/editar/:id`
**Arquivo:** `src/presentation/pages/admin/EditArticlePage/index.tsx`

Mesmo layout do `NewArticlePage`, porém:
- Carrega dados do artigo existente pelo `id`
- Formulário pré-preenchido com `initialData`
- Botão de submit: "Salvar Alterações"
- Redireciona para `/admin` após sucesso

**Estados:**
- **Loading:** Spinner
- **Error:** `ErrorMessage` com retry
- **Not Found:** Mensagem "Artigo não encontrado"

---

## 🧩 Componentes Compartilhados

### UI Components (`src/presentation/components/ui/`)

| Componente | Descrição |
|---|---|
| `Button` | Botão com variantes (primary, ghost, etc.) e loading state |
| `Input` | Campo de texto com label, erro e maxLength |
| `TextArea` | Área de texto com label e erro |
| `LoadingSpinner` | Spinner animado com tamanhos (sm, md, lg) |
| `ErrorMessage` | Card de erro com mensagem e botão "Tentar novamente" |
| `ConfirmDialog` | Modal de confirmação (usado para exclusão) |
| `Modal` | Modal genérico |
| `CacheIndicator` | Indicador visual de cache |
| `ErrorBoundary` | Boundary para capturar erros não tratados |

### Article Components (`src/presentation/components/article/`)

| Componente | Descrição |
|---|---|
| `ArticleCard` | Card para listagem (capa, tags, título, excerpt, autor, data) |
| `ArticleList` | Grid de cards com estados loading/empty/error |
| `ArticleContent` | Layout completo de artigo (header, capa, markdown, footer) |
| `ArticleForm` | Formulário de criação/edição com preview Markdown |
| `MarkdownRenderer` | Renderizador Markdown com tema Dracula |

### Auth Components (`src/presentation/components/auth/`)

| Componente | Descrição |
|---|---|
| `AuthButton` | Botão adaptável: login Google / avatar + nome + sair |
| `UserAvatar` | Avatar com foto ou iniciais, tooltip opcional |
| `ProtectedRoute` | Guard de rota: redireciona se não autenticado/admin |

### Likes Components (`src/presentation/components/likes/`)

| Componente | Descrição |
|---|---|
| `LikeButton` | Botão de like/dislike |
| `LikeCounter` | Contador de likes |

---

## 🎨 Tema e Estilo

### Tema Dracula Dark

Cores definidas em `src/index.css` via `@theme` do Tailwind CSS v4:

| Variável | Cor | Uso |
|---|---|---|
| `dracula-bg` | `#282a36` | Fundo principal |
| `dracula-current` | `#44475a` | Bordas, backgrounds secundários |
| `dracula-fg` | `#f8f8f2` | Texto principal |
| `dracula-comment` | `#6272a4` | Texto secundário, comentários |
| `dracula-cyan` | `#8be9fd` | Links, h2 |
| `dracula-green` | `#50fa7b` | Status "publicado", h3 |
| `dracula-orange` | `#ffb86c` | Status "rascunho", h4 |
| `dracula-pink` | `#ff79c6` | Logo, links ativos, h1, botão primário |
| `dracula-purple` | `#bd93f9` | Tags, strong, blockquote |
| `dracula-red` | `#ff5555` | Erros, botão sair |
| `dracula-yellow` | `#f1fa8c` | Badge "Admin", em |

### Estilos Globais

- **Fonte:** Inter, system-ui, -apple-system
- **Scrollbar customizada** (fina, cor do tema)
- **Seleção de texto:** fundo roxo
- **Focus visible:** outline rosa

---

## 🔐 Autenticação e Controle de Acesso

### Fluxo de Autenticação

```
                    ┌─────────────┐
                    │  AuthProvider│
                    │  (Firebase)  │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         user=null                  user!=null
              │                         │
              ▼                         ▼
       ┌──────────────┐        ┌──────────────────┐
       │  AuthButton   │        │  AuthButton       │
       │  "Entrar c/   │        │  Avatar + Nome    │
       │   Google"     │        │  + "Sair"         │
       └──────────────┘        └──────────────────┘
                                       │
                              ┌────────┴────────┐
                              │                 │
                         role=admin        role!=admin
                              │                 │
                              ▼                 ▼
                    ┌─────────────────┐  ┌──────────────┐
                    │ Nav "Admin"     │  │ Nav "Admin"  │
                    │ visível no      │  │ oculta       │
                    │ MainLayout      │  │              │
                    │ Acesso ao       │  │ Sem acesso   │
                    │ /admin liberado │  │ ao /admin    │
                    └─────────────────┘  └──────────────┘
```

### ProtectedRoute

- **Sem autenticação:** Redireciona para `/login`
- **Autenticado mas não admin (com `requireAdmin`):** Tela "Acesso Restrito" com link para Home
- **Autenticado e admin:** Renderiza o conteúdo protegido

---

## 🧭 Mapa de Navegação

### Usuário Não Autenticado

```
Home (/) ───────────► Artigo (/artigo/:slug)
  │
  └──► Login (/login) ──► (após login) ──► Home (/)
```

### Usuário Autenticado (não admin)

```
Home (/) ───────────► Artigo (/artigo/:slug)
  │
  └──► Login (/login) ──► (já logado) ──► Redirect para Home (/)
```

### Usuário Admin

```
Home (/) ───────────► Artigo (/artigo/:slug)
  │
  ├──► Admin (/admin) ──► Dashboard
  │       │
  │       ├──► Novo Artigo (/admin/artigos/novo)
  │       │       └── (após criar) ──► Redirect para Dashboard
  │       │
  │       └──► Editar Artigo (/admin/artigos/editar/:id)
  │               └── (após salvar) ──► Redirect para Dashboard
  │
  └──► Login (/login) ──► (já logado) ──► Redirect para Home (/)
```

### Qualquer Usuário

```
Rota inexistente (*) ──► 404 (NotFoundPage)
  │
  ├──► "Voltar para Home" ──► Home (/)
  └──► "Voltar" ──► window.history.back()
```

---

## 📁 Estrutura de Diretórios (Presentation Layer)

```
src/presentation/
├── components/
│   ├── article/
│   │   ├── ArticleCard/        ← Card de artigo na listagem
│   │   ├── ArticleContent/     ← Layout completo do artigo
│   │   ├── ArticleForm/        ← Formulário de criação/edição
│   │   ├── ArticleList/        ← Grid de artigos com estados
│   │   └── MarkdownRenderer/   ← Renderizador Markdown
│   ├── auth/
│   │   ├── AuthButton/         ← Botão login/logout adaptável
│   │   ├── ProtectedRoute/     ← Guard de rota
│   │   └── UserAvatar/         ← Avatar do usuário
│   ├── likes/
│   │   ├── LikeButton/         ← Botão de like/dislike
│   │   └── LikeCounter/        ← Contador de likes
│   └── ui/                     ← Componentes genéricos de UI
├── contexts/
│   ├── AuthContext.tsx          ← Provider de autenticação
│   ├── AuthContextDefinition.ts ← Tipos do contexto de auth
│   ├── DIContext.tsx            ← Provider de DI
│   └── DIContextDefinition.ts   ← Tipos do contexto de DI
├── hooks/
│   ├── useArticle.ts           ← Hook para artigo individual
│   ├── useArticles.ts          ← Hook para listagem de artigos
│   ├── useAuth.ts              ← Hook de autenticação
│   ├── useCachedFetch.ts       ← Hook de cache genérico
│   ├── useDI.ts                ← Hook de DI
│   └── useInjection.ts         ← Hook de injeção de dependências
├── layouts/
│   ├── AdminLayout/            ← Layout do painel admin
│   └── MainLayout/             ← Layout público
└── pages/
    ├── admin/
    │   ├── DashboardPage/      ← Dashboard admin
    │   ├── EditArticlePage/    ← Edição de artigo
    │   └── NewArticlePage/     ← Novo artigo
    ├── ArticlePage/            ← Página de artigo
    ├── HomePage/               ← Página inicial
    ├── LoginPage/              ← Página de login
    └── NotFoundPage/           ← Página 404
```

---

## 🚀 Como Rodar o Projeto

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

---

## 📌 Observações

- O layout é **totalmente responsivo**, adaptando-se de mobile a desktop
- O tema **Dracula Dark** é consistente em toda a aplicação
- A navegação admin só aparece para usuários com role `admin`
- O formulário de artigos possui **preview Markdown ao vivo**
- As páginas possuem **tratamento completo de estados** (loading, error, empty, sucesso)
- O cache de artigos (5min listagem, 10min detalhe) reduz chamadas ao Firebase
