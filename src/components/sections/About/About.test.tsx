import { render, screen } from "@testing-library/react";
import { About } from "./About";
import "@testing-library/jest-dom";
import { content } from "@/content";

const expectedCourseraTotal = content.about.certificates.items
  .filter((group) => group.name.toLowerCase() === "coursera")
  .reduce((total, group) => total + (group.count ?? group.items.length), 0);

describe("About Section", () => {
  it("renders improved intro with required highlighted keywords", () => {
    render(<About />);
    expect(screen.getByText("Tran Quoc Dat")).toBeInTheDocument();
    expect(screen.getByText("FPT University")).toBeInTheDocument();
    expect(screen.getByText("Ho Chi Minh City")).toBeInTheDocument();
    expect(screen.getByText("AI Tools")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("SAP Technical Consultant")).toBeInTheDocument();
  });

  it("renders terminal chrome and sections", () => {
    render(<About />);
    expect(screen.getByText(/tqdat410.*-zsh.*80x24/i)).toBeInTheDocument();
    expect(screen.getByText(/Last login:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/tqdat410@portfolio ~ %/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/npm install -g da-portfolio@latest/i)).toBeInTheDocument();
    expect(screen.getByText(/dp --version/i)).toBeInTheDocument();
    expect(screen.getByText(/dp --info/i)).toBeInTheDocument();
  });

  it("renders command result text", () => {
    render(<About />);
    expect(screen.getByText(/added 1 package, and audited 1 package in 88ms/i)).toBeInTheDocument();
    expect(screen.getByText("v4.0.0")).toBeInTheDocument();
    expect(screen.getByText("[ PROFILE ]")).toBeInTheDocument();
    expect(screen.getByText("[ CERTIFICATES ]")).toBeInTheDocument();
    expect(screen.getByText(/\[ok\] completed/i)).toBeInTheDocument();
  });

  it("renders profile details, highlighted GPA, and certificates summary", () => {
    render(<About />);
    expect(screen.getByText(/Name:\s*Tran Quoc Dat/i)).toBeInTheDocument();
    expect(screen.getByText("FPT University")).toBeInTheDocument();
    expect(screen.getByText("GPA: 3.6/4.0")).toHaveClass("font-semibold");
    expect(screen.getByText(`• Coursera: ${expectedCourseraTotal}+`)).toBeInTheDocument();
    expect(screen.getByText(/FPT Software/i)).toBeInTheDocument();
    expect(screen.getByText(/On-Job Training \(OJT\) Certificate/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "/certificates" })).toHaveAttribute("href", "/certificates");
    expect(screen.getByText("Jan 2025 - Apr 2025")).toBeInTheDocument();
  });

  it("renders refactored skill categories in the expected order", () => {
    render(<About />);
    expect(screen.getByText(/Core:\s*ABAP, SAP RAP, Java, SpringBoot/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Tools:\s*Claude Code, Codex, Antigravity/i)).toBeInTheDocument();
    expect(screen.getByText(/Others:\s*OData, MVC, Monolith/i)).toBeInTheDocument();
  });

  it("does not render old section title", () => {
    render(<About />);
    expect(screen.queryByRole("heading", { name: content.about.title })).not.toBeInTheDocument();
  });
});
