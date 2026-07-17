import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button (11.3.1)", () => {
  it("deve renderizar com texto", () => {
    render(<Button>Clique aqui</Button>);
    expect(
      screen.getByRole("button", { name: "Clique aqui" }),
    ).toBeInTheDocument();
  });

  it("deve chamar onClick ao clicar", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Clique</Button>);

    await user.click(screen.getByRole("button", { name: "Clique" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("deve estar desabilitado quando disabled", () => {
    render(<Button disabled>Desabilitado</Button>);
    expect(screen.getByRole("button", { name: "Desabilitado" })).toBeDisabled();
  });

  it("deve estar desabilitado quando isLoading", () => {
    render(<Button isLoading>Carregando</Button>);
    const button = screen.getByRole("button", { name: /carregando/i });
    expect(button).toBeDisabled();
  });

  it("deve renderizar com variante primary por padrão", () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole("button", { name: "Primary" });
    expect(button.className).toContain("bg-dracula-pink");
  });

  it("deve renderizar com variante danger", () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole("button", { name: "Danger" });
    expect(button.className).toContain("bg-dracula-red");
  });

  it("deve renderizar com variante ghost", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole("button", { name: "Ghost" });
    expect(button.className).toContain("bg-transparent");
  });

  it("deve renderizar loading spinner quando isLoading", () => {
    render(<Button isLoading>Carregando</Button>);
    // O spinner é um elemento com animação
    const button = screen.getByRole("button", { name: /carregando/i });
    expect(button.querySelector(".animate-spin")).not.toBeNull();
  });
});
