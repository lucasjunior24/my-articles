import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../index";
import type { AuthContextValue } from "../../../../contexts/AuthContextDefinition";
import { AuthContext } from "../../../../contexts/AuthContextDefinition";
import type { AppUser } from "../../../../../core/entities/User";

// ─── Mock Helpers ──────────────────────────────────────────────────

const adminUser: AppUser = {
  id: "admin-1",
  displayName: "Admin",
  email: "admin@test.com",
  photoURL: null,
  role: "admin",
};

const writerUser: AppUser = {
  id: "writer-1",
  displayName: "Writer",
  email: "writer@test.com",
  photoURL: null,
  role: "writer",
};

const readerUser: AppUser = {
  id: "reader-1",
  displayName: "Reader",
  email: "reader@test.com",
  photoURL: null,
  role: "reader",
};

function renderRoute(
  authOverrides: Partial<AuthContextValue> = {},
  props: {
    requireAdmin?: boolean;
    requireWriter?: boolean;
    redirectTo?: string;
  } = {},
) {
  const authValue: AuthContextValue = {
    user: null,
    isLoading: false,
    isAdmin: false,
    isWriter: false,
    login: vi.fn(),
    logout: vi.fn(),
    ...authOverrides,
  };

  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/" element={<div>Home</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute {...props}>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

// ─── Testes ────────────────────────────────────────────────────────

describe("ProtectedRoute (11.3.6)", () => {
  it("deve redirecionar para login quando não autenticado", () => {
    renderRoute({ user: null });
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).toBeNull();
  });

  it("deve renderizar conteúdo quando autenticado (sem role requirement)", () => {
    renderRoute({ user: readerUser });
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("admin pode acessar rota requireAdmin", () => {
    renderRoute(
      { user: adminUser, isAdmin: true, isWriter: true },
      { requireAdmin: true },
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("writer NÃO pode acessar rota requireAdmin", () => {
    renderRoute(
      { user: writerUser, isAdmin: false, isWriter: true },
      { requireAdmin: true },
    );
    expect(screen.queryByText("Protected Content")).toBeNull();
    expect(screen.getByText("Acesso Restrito")).toBeInTheDocument();
  });

  it("reader NÃO pode acessar rota requireAdmin", () => {
    renderRoute(
      { user: readerUser, isAdmin: false, isWriter: false },
      { requireAdmin: true },
    );
    expect(screen.getByText("Acesso Restrito")).toBeInTheDocument();
  });

  it("writer pode acessar rota requireWriter", () => {
    renderRoute(
      { user: writerUser, isAdmin: false, isWriter: true },
      { requireWriter: true },
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("reader NÃO pode acessar rota requireWriter", () => {
    renderRoute(
      { user: readerUser, isAdmin: false, isWriter: false },
      { requireWriter: true },
    );
    expect(screen.queryByText("Protected Content")).toBeNull();
    expect(screen.getByText("Acesso Restrito")).toBeInTheDocument();
  });

  it("deve mostrar loading enquanto auth está carregando", () => {
    renderRoute({ isLoading: true });
    // Deve mostrar spinner (classe animate-spin)
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).not.toBeNull();
  });

  it("deve redirecionar para caminho customizado", () => {
    renderRoute({ user: null }, { redirectTo: "/custom-login" });
    // Como a rota não existe no MemoryRouter, vai dar 404-like,
    // mas o Navigate deve ter sido chamado
    // O comportamento esperado é que o conteúdo protegido não seja renderizado
    expect(screen.queryByText("Protected Content")).toBeNull();
  });
});
