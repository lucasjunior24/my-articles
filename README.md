<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black&style=for-the-badge" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Clean%20Architecture-🧼-white?style=for-the-badge" />
</p>

<div align="center">
  <h1>📝 My Articles</h1>
  <p><strong>Uma plataforma de blog moderna e colaborativa construída com Clean Architecture</strong></p>
  <p>
    <a href="#-demo">🎥 Demo</a> •
    <a href="#-funcionalidades">⚡ Funcionalidades</a> •
    <a href="#-arquitetura">🧱 Arquitetura</a> •
    <a href="#-stack">🔧 Stack</a> •
    <a href="#-estrutura-de-diretórios">📁 Estrutura</a> •
    <a href="#-rodando-o-projeto">🚀 Rodando</a> •
    <a href="#-scripts-dos-repositórios-de-dados">🗄️ Admin Scripts</a> •
    <a href="#-testes">🧪 Testes</a> •
    <a href="#-licença">📄 Licença</a>
  </p>
</div>

---

## 📖 Sobre

O **My Articles** é uma aplicação full-client-side de blog que combina a **Clean Architecture** de Robert C. Martin (Uncle Bob) com o ecossistema React moderno. Construído com foco em:

- ✅ **Manutenibilidade a longo prazo**
- ✅ **Testabilidade desde a concepção**
- ✅ **Separação clara de responsabilidades**
- ✅ **Baixo acoplamento e alta coesão**
- ✅ **Substituição facilitada de infraestrutura**

O projeto é real-world e funcional: autores podem criar e gerenciar artigos, leitores podem interagir com likes/dislikes, e há um fluxo completo de solicitação/aprovação para novos escritores — tudo isso com autenticação via Firebase e um painel administrativo robusto.

---

## 🎥 Demo

> **Em breve**: Adicione aqui o link de deploy ou screenshots do projeto funcionando.

---

## ⚡ Funcionalidades

### 🏠 Visitantes & Leitores
| Funcionalidade               | Descrição                                                                 |
|------------------------------|---------------------------------------------------------------------------|
| 🗞️ Listagem de Artigos        | Feed com todos os artigos publicados, renderizados em Markdown            |
| 🔍 Leitura de Artigo          | Página individual com conteúdo completo, metadados e data formatada       |
| ❤️ Likes / Dislikes            | Sistema de like/dislike por visitante (baseado em fingerprint de IP)     |

### ✍️ Escritores
| Funcionalidade               | Descrição                                                                 |
|------------------------------|---------------------------------------------------------------------------|
| ✏️ Criação de Artigo          | Editor para novos posts com suporte a Markdown                           |
| 🛠️ Edição de Artigo           | Atualização de artigos existentes pelo autor                              |
| 🗑️ Exclusão de Artigo         | Remoção de artigos próprios                                               |
| 📝 Solicitação de Escrita      | Usuários logados podem solicitar o papel de escritor                      |

### 🛡️ Administradores
| Funcionalidade               | Descrição                                                                 |
|------------------------------|---------------------------------------------------------------------------|
| 👥 Gestão de Solicitações     | Aprovação ou rejeição de pedidos para se tornar escritor                  |
| 🔐 Controle de Papéis (RBAC)  | Perfis `admin`, `writer` e `reader` com permissões isoladas               |

### 🧩 Funcionalidades Técnicas
| Funcionalidade               | Descrição                                                                 |
|------------------------------|---------------------------------------------------------------------------|
| ♻️ Cache de API via IP         | Adaptador de cache que reduz chamadas ao Firestore usando IP do visitante |
| 🧪 Testes Automatizados       | Testes unitários (Vitest) e E2E (Playwright)                              |
| 🔥 Autenticação Firebase      | Login/logout com persistência via Firebase Auth                           |
| 🌐 Roteamento SPA              | React Router DOM 7 com layouts aninhados (Admin vs Público)               |

---

## 🧱 Arquitetura

Este projeto segue os princípios da **Clean Architecture** proposta por Uncle Bob, adaptada para o ecossistema React + TypeScript.

### 🎯 Camadas

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION (UI)                       │
│  React Components, Pages, Hooks, Contexts, Layouts          │
│  Depende de: Core (Use Cases)                               │
├─────────────────────────────────────────────────────────────┤
│                         CORE (Domain)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   ENTITIES   │  │  USE CASES   │  │  PORTS (interf.) │  │
│  │  Article.ts  │  │ CreateArticle│  │ ArticleRepoPort  │  │
│  │  User.ts     │  │ GetArticles  │  │ AuthRepoPort     │  │
│  │  LikeDislike │  │ ToggleLike   │  │  CachePort       │  │
│  │  CacheEntry  │  │ Login/Logout │  │  LikeRepoPort    │  │
│  │ WriterRequest│  │ ApproveWriter│  │ WriterReqPort    │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│  Zero dependências externas                                 │
├─────────────────────────────────────────────────────────────┤
│                     ADAPTERS (Infrastructure)               │
│  ┌────────────┐  ┌───────────────┐  ┌──────────────────┐   │
│  │   Cache    │  │   Firebase    │  │      HTTP        │   │
│  │ IPCache    │  │ ArticleAdapter│  │   IPFetcher      │   │
│  │  Adapter   │  │ AuthAdapter   │  │                  │   │
│  │            │  │ LikeAdapter   │  │                  │   │
│  │            │  │ WriterReqAdap │  │                  │   │
│  └────────────┘  └───────────────┘  └──────────────────┘   │
│  Implementa os Ports do Core                                │
├─────────────────────────────────────────────────────────────┤
│                     SHARED (Kernel)                         │
│  Constants, Types, Utils (dateFormat, slugify, validators)  │
├─────────────────────────────────────────────────────────────┤
│                       DI (Composition Root)                 │
│  Container.ts + types.ts — Injeção de Dependências manual   │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 Fluxo de Dependência (Regra de Ouro)

```
Presentation  ────►  Core (Use Cases)  ◄────  Adapters
     │                      │                      │
     │                      ▼                      │
     │              Core (Ports/Entities)           │
     │                      ▲                      │
     └──────────────────────┴──────────────────────┘
            Dependem apenas de abstrações
```

> **A regra mais importante da Clean Architecture**: O código-fonte só pode apontar para dentro. Nada na camada interna pode saber algo sobre a camada externa. `Core` não importa nada de `Presentation`, `Adapters` ou frameworks.

### 🧩 Injeção de Dependências

O projeto utiliza um **container DI customizado e tipado estaticamente** (sem bibliotecas externas como InversifyJS).

```typescript
// src/di/types.ts — Interface do Container com type-safety total
export interface Container {
  articleAdapter: FirebaseArticleAdapter;
  authAdapter: FirebaseAuthAdapter;
  cacheAdapter: IPCacheAdapter;
  // ...
  createArticleUseCase: CreateArticleUseCase;
  getArticlesUseCase: GetArticlesUseCase;
  // ...
}
```

Os hooks do React consomem o container via `DIContext`:

```typescript
const { createArticleUseCase } = useDI();
```

Isso elimina dependências hard-coded e permite **mockar** qualquer dependência nos testes — sem esforço.

---

## 🔧 Stack

### 🏗️ Core
| Tecnologia              | Versão | Descrição                                    |
|-------------------------|--------|----------------------------------------------|
| **React**               | 19     | Biblioteca UI declarativa                    |
| **TypeScript**          | 6.0    | Tipagem estática avançada                    |
| **Vite**                | 8      | Bundler ultrarrápido com HMR                 |
| **React Router DOM**    | 7      | Roteamento SPA declarativo                   |

### 🎨 Estilo & Conteúdo
| Tecnologia              | Versão | Descrição                                    |
|-------------------------|--------|----------------------------------------------|
| **Tailwind CSS**        | 4      | Utility-first CSS framework                  |
| **@tailwindcss/typography** | 0.5  | Plugin de tipografia para Markdown           |
| **React Markdown**      | 10     | Renderização de Markdown em React            |

### 🔥 Backend & Infra
| Tecnologia              | Versão | Descrição                                    |
|-------------------------|--------|----------------------------------------------|
| **Firebase**            | 12     | Auth + Firestore (Client SDK)                |
| **Firebase Admin**      | 13     | Admin SDK para scripts server-side            |
| **UUID**                | 14     | Geração de IDs únicos                        |

### 🧪 Testes
| Tecnologia              | Versão | Descrição                                    |
|-------------------------|--------|----------------------------------------------|
| **Vitest**              | 4      | Test runner unitário rápido                  |
| **Playwright**          | 1.61   | Testes end-to-end multi-browser              |
| **Testing Library**     | 16     | Utilitários de teste focados no usuário      |
| **jest-dom**            | 6      | Matchers customizados para assertions do DOM |

### 🧰 Dev & Lint
| Tecnologia              | Versão | Descrição                                    |
|-------------------------|--------|----------------------------------------------|
| **ESLint**              | 10     | Linter configurável                          |
| **typescript-eslint**   | 8      | Regras ESLint para TypeScript                |
| **PostCSS**             | 8      | Pós-processamento CSS                        |
| **Autoprefixer**        | 10     | Vendor prefixes automáticos                  |

---

## 📁 Estrutura de Diretórios

```
blog-lucas/
├── .env.example                     # Template de variáveis de ambiente
├── .gitignore
├── commands.txt                     # Referência rápida de comandos úteis
├── eslint.config.js                 # Configuração ESLint (flat config)
├── index.html                       # Entry point HTML
├── LAYOUT.md                        # Documentação detalhada do layout
├── package.json
├── tsconfig.json                    # TypeScript base config
├── tsconfig.app.json                # TS config para código da aplicação
├── tsconfig.node.json               # TS config para tooling (Vite, etc.)
├── vite.config.ts                   # Configuração do Vite + Tailwind
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── scripts/                         # Scripts auxiliares via Firebase Admin
│   ├── set-admin.js                 # Promover usuário a admin
│   └── set-role.js                  # Definir papel (role) de usuário
│
└── src/
    ├── main.tsx                     # Bootstrap da aplicação React
    ├── App.tsx                      # Componente raiz com rotas
    ├── App.css
    ├── index.css                    # Estilos globais e reset
    │
    ├── core/                        # 🧠 CAMADA DE DOMÍNIO (Inner Layer)
    │   ├── entities/                # Modelos de negócio puros
    │   │   ├── Article.ts
    │   │   ├── CacheEntry.ts
    │   │   ├── LikeDislike.ts
    │   │   ├── User.ts
    │   │   └── WriterRequest.ts
    │   ├── ports/                   # Interfaces de repositórios (contratos)
    │   │   ├── ArticleRepositoryPort.ts
    │   │   ├── AuthRepositoryPort.ts
    │   │   ├── CachePort.ts
    │   │   ├── LikeRepositoryPort.ts
    │   │   └── WriterRequestRepositoryPort.ts
    │   ├── use-cases/               # Casos de uso (Application Layer)
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
    │   │   ├── likes/
    │   │   │   ├── ToggleLikeUseCase.ts
    │   │   │   └── GetArticleLikesUseCase.ts
    │   │   └── writer/
    │   │       ├── RequestWriterUseCase.ts
    │   │       ├── ApproveWriterUseCase.ts
    │   │       └── GetWriterRequestsUseCase.ts
    │   └── errors/                  # Erros de domínio tipados
    │       ├── DomainError.ts
    │       ├── UnauthorizedError.ts
    │       └── ValidationError.ts
    │
    ├── adapters/                    # 🔌 CAMADA DE INFRAESTRUTURA (Outer Layer)
    │   ├── firebase/
    │   │   ├── firebaseConfig.ts    # Inicialização do Firebase
    │   │   ├── FirebaseArticleAdapter.ts
    │   │   ├── FirebaseAuthAdapter.ts
    │   │   ├── FirebaseLikeAdapter.ts
    │   │   └── FirebaseWriterRequestAdapter.ts
    │   ├── cache/
    │   │   └── IPCacheAdapter.ts    # Cache baseado em IP
    │   └── http/
    │       └── IPFetcher.ts         # Cliente HTTP para obter IP do usuário
    │
    ├── presentation/                # 🎨 CAMADA DE APRESENTAÇÃO (UI)
    │   ├── components/
    │   │   ├── article/             # Componentes relacionados a artigos
    │   │   ├── auth/                # Componentes de autenticação
    │   │   ├── likes/               # Componentes de like/dislike
    │   │   ├── ui/                  # Componentes UI reutilizáveis
    │   │   └── writer/              # Componentes de solicitação de escritor
    │   ├── contexts/
    │   │   ├── AuthContext.tsx       # Contexto de autenticação
    │   │   ├── AuthContextDefinition.ts
    │   │   ├── DIContext.tsx         # Contexto de injeção de dependências
    │   │   └── DIContextDefinition.ts
    │   ├── hooks/                   # Hooks personalizados
    │   │   ├── useArticle.ts
    │   │   ├── useArticles.ts
    │   │   ├── useAuth.ts
    │   │   ├── useCachedFetch.ts
    │   │   ├── useDI.ts
    │   │   ├── useInjection.ts
    │   │   ├── useLike.ts
    │   │   └── useWriterRequest.ts
    │   ├── layouts/
    │   │   ├── MainLayout/          # Layout público (visitantes/leitores)
    │   │   └── AdminLayout/         # Layout administrativo (admin)
    │   └── pages/
    │       ├── HomePage/            # Feed de artigos
    │       ├── ArticlePage/         # Página individual do artigo
    │       ├── LoginPage/           # Página de login
    │       ├── NotFoundPage/        # Página 404
    │       └── admin/
    │           └── WriterRequestsPage/  # Gestão de solicitações (admin)
    │
    ├── di/                          # 🧬 COMPOSITION ROOT
    │   ├── container.ts             # Container DI com instâncias reais
    │   └── types.ts                 # Tipagem completa do container
    │
    └── shared/                      # 📦 KERNEL COMPARTILHADO
        ├── constants/
        │   ├── cache.ts             # Constantes de cache
        │   └── roles.ts             # Definições de papéis (admin, writer, reader)
        ├── types/
        │   ├── api.ts               # Tipos de API
        │   └── common.ts            # Tipos comuns
        └── utils/
            ├── dateFormat.ts        # Formatação de datas
            ├── slugify.ts           # Geração de slugs amigáveis
            └── validators.ts        # Funções de validação
```

---

## 🚀 Rodando o Projeto

### 📋 Pré-requisitos

- **Node.js** ≥ 20
- **npm** ≥ 9 (ou `yarn` / `pnpm`)
- Uma conta no **[Firebase](https://firebase.google.com/)** com os serviços habilitados:
  - 🔐 **Authentication** (Google ou Email/Senha)
  - 🗄️ **Cloud Firestore** (Database)

### ⚙️ 1. Clone & Instale

```bash
git clone git@github.com:lucasjunior24/my-articles.git blog-lucas
cd blog-lucas
npm install
```

### 🔐 2. Configure as Variáveis de Ambiente

Copie o arquivo de exemplo e preencha com as credenciais do seu projeto Firebase:

```bash
cp .env.example .env
```

```env
# .env
VITE_FIREBASE_API_KEY=AIzaSySeuFirebaseApiKey123
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ
```

> ⚠️ **Importante**: Nunca comite o arquivo `.env`. Ele já está no `.gitignore`.

### 🖥️ 3. Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse **http://localhost:5173** no navegador.

### 🏗️ 4. Build de Produção

```bash
npm run build
npm run preview     # Para testar localmente o build de produção
```

---

## 🗄️ Scripts dos Repositórios de Dados (Firebase)

Os scripts em `scripts/` utilizam o **Firebase Admin SDK** para operações que exigem privilégios elevados no servidor.

> ⚠️ Estes scripts necessitam de um arquivo de **Service Account Key** do Firebase. Adicione-o como `serviceAccountKey.json` no diretório `scripts/` (já está no `.gitignore`).

### Promover usuário a Admin

```bash
node scripts/set-admin.js <UID_DO_USUARIO>
```

### Definir papel específico

```bash
node scripts/set-role.js <UID_DO_USUARIO> <ROLE>
# Exemplo:
node scripts/set-role.js abc123xyz writer
node scripts/set-role.js abc123xyz admin
node scripts/set-role.js abc123xyz reader
```

---

## 🧪 Testes

### Testes Unitários (Vitest)

```bash
npm run vitest
# ou com watch mode
npx vitest --watch
```

### Testes End-to-End (Playwright)

```bash
npx playwright test
# ou com UI interativa
npx playwright test --ui
```

### Lint

```bash
npm run lint
```

---

## 🎯 Padrões de Projeto Utilizados

| Padrão                    | Aplicação                                                |
|---------------------------|----------------------------------------------------------|
| **Clean Architecture**    | Separação em camadas concêntricas Core → Adapters → UI  |
| **Dependency Injection**  | Container DI tipado estáticamente                        |
| **Repository Pattern**    | `Ports` (interfaces) + `Adapters` (implementações)      |
| **Use Case Pattern**      | Cada ação do sistema tem seu próprio caso de uso         |
| **DTO Pattern**           | Tipos de entrada/saída definidos em cada caso de uso     |
| **Composition Root**      | `src/di/container.ts` como ponto único de wiring         |
| **Context API (React)**   | AuthContext e DIContext para propagação de estado        |
| **Custom Hooks**          | Abstração de lógica de UI (useAuth, useArticle, etc.)    |
| **Factory Method**        | Construção de instâncias no container DI                 |

---

## 🧠 Princípios SOLID

- **S** — Single Responsibility: Cada classe/módulo tem uma única razão para mudar
- **O** — Open/Closed: Ports permitem estender com novos adaptadores sem modificar o Core
- **L** — Liskov Substitution: Adaptadores implementam fielmente os contratos dos Ports
- **I** — Interface Segregation: Ports são enxutos e específicos por contexto (Article, Auth, Like, etc.)
- **D** — Dependency Inversion: Camadas de alto nível (Use Cases) dependem de abstrações (Ports), não de implementações concretas

---

## 🗺️ Roadmap

- [ ] **PWA**: Transformar em Progressive Web App com suporte offline
- [ ] **Comentários**: Sistema de comentários nos artigos
- [ ] **Busca**: Busca full-text nos artigos
- [ ] **Temas**: Dark mode / Light mode toggle
- [ ] **Upload de Imagens**: Suporte a imagens via Firebase Storage
- [ ] **SEO**: SSR ou SSG para melhor indexação
- [ ] **CI/CD**: Pipeline de testes e deploy automatizado
- [ ] **Deploy**: Configuração de deploy para Vercel/Netlify/Firebase Hosting

---

## 🤝 Contribuindo

Contribuições são bem-vindas! O projeto segue Clean Architecture estritamente — qualquer contribuição deve respeitar a direção das dependências (de fora para dentro).

1. Fork o repositório
2. Crie uma branch: `git checkout -b feat/minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: adiciona minha feature'`
4. Push para a branch: `git push origin feat/minha-feature`
5. Abra um Pull Request

> Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/) para as mensagens de commit.

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

---

<div align="center">
  <p>Feito com ❤️ usando Clean Architecture + React + TypeScript + Firebase</p>
  <p>
    <sub>
      Dúvidas? Abra uma <a href="https://github.com/lucasjunior24/my-articles/issues">issue</a>!
    </sub>
  </p>
</div>