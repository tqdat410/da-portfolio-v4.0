import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Projects } from "./Projects";
import "@testing-library/jest-dom";
import { content } from "@/content";

// Mock the Image component from next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...rest} alt={rest.alt as string} />;
  },
}));

describe("Projects Section", () => {
  const projects = content.projects.items;
  const sapProject = projects.find((p) => p.category === "Enterprise")!;
  const startupProject = projects.find((p) => p.category === "Startup")!;

  it("renders the Projects section title", () => {
    render(<Projects />);
    expect(screen.getByText(content.projects.title)).toBeInTheDocument();
  });

  it("renders category labels", () => {
    render(<Projects />);
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    expect(screen.getByText("Startup")).toBeInTheDocument();
    expect(screen.getByText("Educational")).toBeInTheDocument();
    expect(screen.getByText("Others")).toBeInTheDocument();
  });

  it("renders project items from different categories", () => {
    render(<Projects />);
    expect(screen.getByText(sapProject.title)).toBeInTheDocument();
    expect(screen.getByText(startupProject.title)).toBeInTheDocument();
  });

  it("does not render removed projects (Portfolio V1, V2)", () => {
    render(<Projects />);
    expect(screen.queryByText("Portfolio V1")).not.toBeInTheDocument();
    expect(screen.queryByText("Portfolio V2")).not.toBeInTheDocument();
  });

  it("opens project modal on click and displays project details", async () => {
    render(<Projects />);

    fireEvent.click(screen.getByText(sapProject.title));

    await waitFor(() => {
      expect(screen.getByText(sapProject.longDescription)).toBeInTheDocument();
    });
  });

  it("closes project modal when close button is clicked", async () => {
    render(<Projects />);

    expect(screen.queryByText(sapProject.longDescription)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(sapProject.title));

    await waitFor(() => {
      expect(screen.getByText(sapProject.longDescription)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: content.projectPopup.close }));

    await waitFor(() => {
      expect(screen.queryByText(sapProject.longDescription)).not.toBeInTheDocument();
    });
  });
});
