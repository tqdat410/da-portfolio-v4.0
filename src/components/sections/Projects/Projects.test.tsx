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
  const firstProject = projects[0];
  const secondProject = projects[1];

  it("renders the Projects section title", () => {
    render(<Projects />);
    expect(screen.getByText(content.projects.title)).toBeInTheDocument();
  });

  it("renders project items", () => {
    render(<Projects />);
    expect(screen.getByText(firstProject.title)).toBeInTheDocument();
    expect(screen.getByText(secondProject.title)).toBeInTheDocument();
    // Check tech stack items (use getAllByText since some tech may appear in multiple projects)
    expect(screen.getAllByText(firstProject.techStack[0]).length).toBeGreaterThan(0);
    expect(screen.getAllByText(secondProject.techStack[0]).length).toBeGreaterThan(0);
  });

  it("opens project modal on click and displays project details", async () => {
    render(<Projects />);

    // Click on first project
    fireEvent.click(screen.getByText(firstProject.title));

    // Wait for the modal to appear and display its content
    await waitFor(() => {
      expect(screen.getByText(firstProject.longDescription)).toBeInTheDocument();
    });
  });

  it("closes project modal when close button is clicked", async () => {
    render(<Projects />);

    expect(screen.queryByText(firstProject.longDescription)).not.toBeInTheDocument();

    // Open the modal
    fireEvent.click(screen.getByText(firstProject.title));

    // Wait for the modal to be open
    await waitFor(() => {
      expect(screen.getByText(firstProject.longDescription)).toBeInTheDocument();
    });

    // Click the close button
    fireEvent.click(screen.getByRole("button", { name: content.projectPopup.close }));

    // Wait for the modal to be closed
    await waitFor(() => {
      expect(screen.queryByText(firstProject.longDescription)).not.toBeInTheDocument();
    });
  });
});
