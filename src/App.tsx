import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./presentation/layouts/MainLayout";
import { HomePage } from "./presentation/pages/HomePage";
import { ArticlePage } from "./presentation/pages/ArticlePage";
import { LoginPage } from "./presentation/pages/LoginPage";
import { NotFoundPage } from "./presentation/pages/NotFoundPage";
import { ProtectedRoute } from "./presentation/components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/artigo/:slug" element={<ArticlePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin routes — protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <div>Admin Dashboard (em breve)</div>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
