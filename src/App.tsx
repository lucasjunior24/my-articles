import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./presentation/layouts/MainLayout";
import { AdminLayout } from "./presentation/layouts/AdminLayout";
import { HomePage } from "./presentation/pages/HomePage";
import { ArticlePage } from "./presentation/pages/ArticlePage";
import { LoginPage } from "./presentation/pages/LoginPage";
import { NotFoundPage } from "./presentation/pages/NotFoundPage";
import { DashboardPage } from "./presentation/pages/admin/DashboardPage";
import { NewArticlePage } from "./presentation/pages/admin/NewArticlePage";
import { EditArticlePage } from "./presentation/pages/admin/EditArticlePage";
import { WriterRequestsPage } from "./presentation/pages/admin/WriterRequestsPage";
import { ProtectedRoute } from "./presentation/components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/artigo/:slug" element={<ArticlePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
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
          <Route index element={<DashboardPage />} />
          <Route path="artigos/novo" element={<NewArticlePage />} />
          <Route path="artigos/editar/:id" element={<EditArticlePage />} />
          {/* Admin-only routes */}
          <Route
            path="solicitacoes-writer"
            element={
              <ProtectedRoute requireAdmin>
                <WriterRequestsPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
