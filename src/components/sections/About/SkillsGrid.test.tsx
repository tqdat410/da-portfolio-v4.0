import { render, screen } from "@testing-library/react";
import { SkillsGrid } from "./SkillsGrid";
import "@testing-library/jest-dom";
import { content } from "@/content";

describe("SkillsGrid", () => {
  const { categories } = content.about.skills;

  it("renders all skill categories and their items", () => {
    render(<SkillsGrid />);

    // Check Backend Skills
    expect(screen.getByText(categories.backend.title)).toBeInTheDocument();
    categories.backend.items.slice(0, 3).forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });

    // Check Frontend Skills
    expect(screen.getByText(categories.frontend.title)).toBeInTheDocument();
    categories.frontend.items.slice(0, 3).forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });

    // Check Database Skills
    expect(screen.getByText(categories.database.title)).toBeInTheDocument();
    categories.database.items.slice(0, 3).forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });

    // Check Tools
    expect(screen.getByText(categories.tools.title)).toBeInTheDocument();
    categories.tools.items.slice(0, 3).forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("renders the data-testid attribute", () => {
    render(<SkillsGrid />);
    expect(screen.getByTestId("skills-grid")).toBeInTheDocument();
  });
});
