import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthButton } from "../index";
import type { AuthContextValue } from "../../../../contexts/AuthContextDefinition";
import { AuthContext } from "../../../../contexts/AuthContextDefinition";
import type { AppUser } from "../../../../../core/entities/User";

// ─── Mock Helpers ──────────────────────────────────────────────────

const mockUser: AppUser = {
  id: "user-1",
  displayName: "Lucas Souza",
  email: "lucas@test.com",
  photoURL: null,
  role: "reader",
};

const mockAdminUser: AppUser = {
  ...mockUser,
  id: "admin-1",
  displayName: "Admin User",
  email: "admin@test.com",
  role: "admin",
};

function renderWithAuth(overrides: Partial<AuthContextValue> = {}) {
  const value: AuthContextValue = {
    user: null,
    isLoading: false,
    isAdmin: false,
    isWriter: false,
    login: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  };

  return render(
    <AuthContext.Provider value={value}>
      <AuthButton />
    </AuthContext.Provider>,
  );
}

// ─── Testes ────────────────────────────────────────────────────────

describe("AuthButton (11.3.3)", () => {
  it("deve renderizar botão de login quando não logado", () => {
    renderWithAuth({ user: null });
    expect(screen.getByText("Entrar com Google")).toBeInTheDocument();
  });

  it("deve chamar login ao clicar no botão de login", async () => {
    const login = vi.fn();
    const user = userEvent.setup();
    renderWithAuth({ user: null, login });

    await user.click(
      screen.getByRole("button", { name: /entrar com google/i }),
    );
    expect(login).toHaveBeenCalledTimes(1);
  });

  it("deve renderizar avatar e nome quando logado", () => {
    renderWithAuth({ user: mockUser });
    expect(screen.getByText("Lucas Souza")).toBeInTheDocument();
  });

  it("deve mostrar badge de admin quando usuário é admin", () => {
    renderWithAuth({ user: mockAdminUser, isAdmin: true });
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("deve chamar logout ao clicar em Sair", async () => {
    const logout = vi.fn();
    const user = userEvent.setup();
    renderWithAuth({ user: mockUser, logout });

    await user.click(screen.getByRole("button", { name: "Sair" }));
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it("deve mostrar skeleton durante loading", () => {
    renderWithAuth({ isLoading: true });
    // O skeleton tem classe animate-pulse
    const container = document.querySelector(".animate-pulse");
    expect(container).not.toBeNull();
  });
});
