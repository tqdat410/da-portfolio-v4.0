import { render, screen } from "@testing-library/react";
import { Projects } from "./Projects";
import "@testing-library/jest-dom";
import { content } from "@/content";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...rest} alt={rest.alt as string} />;
  },
}));

// Mock next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: Record<string, unknown>) => (
    <a href={href as string} {...rest}>
      {children as React.ReactNode}
    </a>
  ),
}));

describe("Projects Section", () => {
  const showcaseItems = content.showcase.items;

  it("renders the Projects section title", () => {
    render(<Projects />);
    expect(screen.getByText(content.projects.title)).toBeInTheDocument();
  });

  it("renders showcase item titles", () => {
    render(<Projects />);
    for (const item of showcaseItems) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    }
  });

  it("renders showcase item descriptions", () => {
    render(<Projects />);
    for (const item of showcaseItems) {
      expect(screen.getByText(item.description)).toBeInTheDocument();
    }
  });

  it("does not render removed projects (Portfolio V1, V2)", () => {
    render(<Projects />);
    expect(screen.queryByText("Portfolio V1")).not.toBeInTheDocument();
    expect(screen.queryByText("Portfolio V2")).not.toBeInTheDocument();
  });
});
