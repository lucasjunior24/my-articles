import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./presentation/layouts/MainLayout";
import { AdminLayout } from "./presentation/layouts/AdminLayout";
import { ProtectedRoute } from "./presentation/components/auth/ProtectedRoute";
import { LoadingSpinner } from "./presentation/components/ui/LoadingSpinner";

// ---------------------------------------------------------------------------
// Lazy-loaded pages — code splitting por rota (Admin vs Público)
// ---------------------------------------------------------------------------

// Públicas
const HomePage = lazy(() =>
  import("./presentation/pages/HomePage").then((m) => ({
    default: m.HomePage,
  })),
);
const ArticlePage = lazy(() =>
  import("./presentation/pages/ArticlePage").then((m) => ({
    default: m.ArticlePage,
  })),
);
const LoginPage = lazy(() =>
  import("./presentation/pages/LoginPage").then((m) => ({
    default: m.LoginPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("./presentation/pages/NotFoundPage").then((m) => ({
    default: m.NotFoundPage,
  })),
);

// Admin
const DashboardPage = lazy(() =>
  import("./presentation/pages/admin/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);
const NewArticlePage = lazy(() =>
  import("./presentation/pages/admin/NewArticlePage").then((m) => ({
    default: m.NewArticlePage,
  })),
);
const EditArticlePage = lazy(() =>
  import("./presentation/pages/admin/EditArticlePage").then((m) => ({
    default: m.EditArticlePage,
  })),
);
const WriterRequestsPage = lazy(() =>
  import("./presentation/pages/admin/WriterRequestsPage").then((m) => ({
    default: m.WriterRequestsPage,
  })),
);

// ---------------------------------------------------------------------------
// Suspense fallback compartilhado
// ---------------------------------------------------------------------------
const PageLoader = (
  <div className="flex flex-col items-center justify-center py-20">
    <LoadingSpinner size="lg" />
    <p className="mt-4 text-dracula-comment text-sm animate-pulse">
      Carregando...
    </p>
  </div>
);

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={PageLoader}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/artigo/:slug"
            element={
              <Suspense fallback={PageLoader}>
                <ArticlePage />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={PageLoader}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={PageLoader}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>

        {/* Admin/Writers routes — protected (admin + writer) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireWriter>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={PageLoader}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="artigos/novo"
            element={
              <Suspense fallback={PageLoader}>
                <NewArticlePage />
              </Suspense>
            }
          />
          <Route
            path="artigos/editar/:id"
            element={
              <Suspense fallback={PageLoader}>
                <EditArticlePage />
              </Suspense>
            }
          />
          {/* Admin-only routes */}
          <Route
            path="solicitacoes-writer"
            element={
              <ProtectedRoute requireAdmin>
                <Suspense fallback={PageLoader}>
                  <WriterRequestsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
