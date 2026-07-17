import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RequestWriterButton } from "../index";
import type { AuthContextValue } from "../../../../contexts/AuthContextDefinition";
import { AuthContext } from "../../../../contexts/AuthContextDefinition";
import { DIContext } from "../../../../contexts/DIContextDefinition";
// ─── Mock Container ────────────────────────────────────────────────

function makeMockContainer() {
  return {
    writerRequestAdapter: {
      findByUserId: vi.fn().mockResolvedValue(null),
      createRequest: vi.fn(),
      findAll: vi.fn(),
      updateRequest: vi.fn(),
    },
    requestWriterUseCase: {
      execute: vi.fn(),
    },
  };
}

// ─── Render Helper ────────────────────────────────────────────────

function renderButton(authOverrides: Partial<AuthContextValue> = {}) {
  const authValue: AuthContextValue = {
    user: null,
    isLoading: false,
    isAdmin: false,
    isWriter: false,
    login: vi.fn(),
    logout: vi.fn(),
    ...authOverrides,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const container = makeMockContainer() as any;

  return render(
    <AuthContext.Provider value={authValue}>
      <DIContext.Provider value={{ container, isLoading: false, error: null }}>
        <RequestWriterButton />
      </DIContext.Provider>
    </AuthContext.Provider>,
  );
}

// ─── Testes ────────────────────────────────────────────────────────

describe("RequestWriterButton (11.3.5)", () => {
  const readerUser = {
    id: "reader-1",
    displayName: "Leitor",
    email: "reader@test.com",
    photoURL: null,
    role: "reader" as const,
  };

  it("reader sem solicitação deve ver botão 'Quero Escrever'", () => {
    renderButton({
      user: readerUser,
      isAdmin: false,
      isWriter: false,
    });
    expect(screen.getByText("Quero Escrever")).toBeInTheDocument();
  });

  it("admin não deve ver o botão", () => {
    renderButton({
      user: { ...readerUser, id: "admin-1", role: "admin" },
      isAdmin: true,
      isWriter: true,
    });
    expect(screen.queryByText("Quero Escrever")).toBeNull();
  });

  it("writer não deve ver o botão", () => {
    renderButton({
      user: { ...readerUser, id: "writer-1", role: "writer" },
      isAdmin: false,
      isWriter: true,
    });
    expect(screen.queryByText("Quero Escrever")).toBeNull();
  });

  it("não logado não deve renderizar nada", () => {
    const { container } = renderButton({
      user: null,
    });
    expect(container.innerHTML).toBe("");
  });
});
