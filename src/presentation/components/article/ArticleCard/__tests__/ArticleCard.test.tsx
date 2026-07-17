import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ArticleCard } from "../index";
import type { Article } from "../../../../../core/entities/Article";

const mockArticle: Article = {
  id: "art-1",
  title: "Como Aprender React",
  slug: "como-aprender-react",
  content: "Conteúdo completo do artigo sobre React...",
  excerpt: "Um guia prático para iniciantes em React com exemplos.",
  tags: ["react", "javascript", "frontend"],
  coverImage: "https://example.com/cover.jpg",
  authorId: "user-1",
  authorName: "Lucas Souza",
  status: "published",
  likeCount: 10,
  dislikeCount: 1,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-20"),
};

describe("ArticleCard (11.3.2)", () => {
  function renderCard(article = mockArticle) {
    return render(
      <MemoryRouter>
        <ArticleCard article={article} />
      </MemoryRouter>,
    );
  }

  it("deve renderizar o título do artigo", () => {
    renderCard();
    expect(screen.getByText("Como Aprender React")).toBeInTheDocument();
  });

  it("deve renderizar o excerpt do artigo", () => {
    renderCard();
    expect(
      screen.getByText(
        "Um guia prático para iniciantes em React com exemplos.",
      ),
    ).toBeInTheDocument();
  });

  it("deve renderizar as tags do artigo", () => {
    renderCard();
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("javascript")).toBeInTheDocument();
    expect(screen.getByText("frontend")).toBeInTheDocument();
  });

  it("deve renderizar o nome do autor", () => {
    renderCard();
    expect(screen.getByText("Lucas Souza")).toBeInTheDocument();
  });

  it("deve linkar para a página do artigo usando slug", () => {
    renderCard();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/artigo/como-aprender-react");
  });

  it("deve renderizar a imagem de capa quando presente", () => {
    renderCard();
    const img = screen.getByRole("img", { name: "Como Aprender React" });
    expect(img).toHaveAttribute("src", "https://example.com/cover.jpg");
  });

  it("deve renderizar placeholder quando sem imagem de capa", () => {
    const articleWithoutCover = { ...mockArticle, coverImage: null };
    renderCard(articleWithoutCover);
    // Não deve ter imagem, mas ainda deve ter o link
    const link = screen.getByRole("link");
    expect(link.querySelector("img[alt='Como Aprender React']")).toBeNull();
  });

  it("deve mostrar +N quando há mais de 3 tags", () => {
    const articleManyTags = {
      ...mockArticle,
      tags: ["react", "js", "ts", "css", "html"],
    };
    renderCard(articleManyTags);
    expect(screen.getByText("+2")).toBeInTheDocument();
  });
});
