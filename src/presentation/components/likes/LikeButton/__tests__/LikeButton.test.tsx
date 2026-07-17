import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LikeButton } from "../index";

describe("LikeButton (11.3.4)", () => {
  const defaultProps = {
    likeCount: 10,
    dislikeCount: 3,
    userVote: "none" as const,
    isLoading: false,
    isLoggedIn: true,
    onLike: vi.fn(),
    onDislike: vi.fn(),
  };

  it("deve renderizar contagem de likes", () => {
    render(<LikeButton {...defaultProps} />);
    expect(screen.getByLabelText("Like (10)")).toBeInTheDocument();
  });

  it("deve renderizar contagem de dislikes", () => {
    render(<LikeButton {...defaultProps} />);
    expect(screen.getByLabelText("Dislike (3)")).toBeInTheDocument();
  });

  it("deve chamar onLike ao clicar no botão like", async () => {
    const onLike = vi.fn();
    const user = userEvent.setup();
    render(<LikeButton {...defaultProps} onLike={onLike} />);

    await user.click(screen.getByLabelText("Like (10)"));
    expect(onLike).toHaveBeenCalledTimes(1);
  });

  it("deve chamar onDislike ao clicar no botão dislike", async () => {
    const onDislike = vi.fn();
    const user = userEvent.setup();
    render(<LikeButton {...defaultProps} onDislike={onDislike} />);

    await user.click(screen.getByLabelText("Dislike (3)"));
    expect(onDislike).toHaveBeenCalledTimes(1);
  });

  it("deve marcar like como ativo quando userVote = 'like'", () => {
    render(<LikeButton {...defaultProps} userVote="like" />);
    const likeBtn = screen.getByLabelText("Like (10)");
    expect(likeBtn.getAttribute("aria-pressed")).toBe("true");
  });

  it("deve marcar dislike como ativo quando userVote = 'dislike'", () => {
    render(<LikeButton {...defaultProps} userVote="dislike" />);
    const dislikeBtn = screen.getByLabelText("Dislike (3)");
    expect(dislikeBtn.getAttribute("aria-pressed")).toBe("true");
  });

  it("deve desabilitar botões quando não logado", () => {
    render(<LikeButton {...defaultProps} isLoggedIn={false} />);
    expect(screen.getByLabelText("Like (10)")).toBeDisabled();
    expect(screen.getByLabelText("Dislike (3)")).toBeDisabled();
  });

  it("deve desabilitar botões durante loading", () => {
    render(<LikeButton {...defaultProps} isLoading />);
    expect(screen.getByLabelText("Like (10)")).toBeDisabled();
    expect(screen.getByLabelText("Dislike (3)")).toBeDisabled();
  });

  it("deve mostrar spinner durante loading", () => {
    render(<LikeButton {...defaultProps} isLoading />);
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).not.toBeNull();
  });
});
