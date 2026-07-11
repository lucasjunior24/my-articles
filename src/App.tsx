import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./presentation/layouts/MainLayout";
import { HomePage } from "./presentation/pages/HomePage";
import { ArticlePage } from "./presentation/pages/ArticlePage";
import { LoginPage } from "./presentation/pages/LoginPage";
import { NotFoundPage } from "./presentation/pages/NotFoundPage";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
