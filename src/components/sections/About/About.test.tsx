import { render, screen, fireEvent } from "@testing-library/react";
import { About } from "./About";
import "@testing-library/jest-dom";
import { content } from "@/content";

describe("About Section", () => {
  it("renders the About section title and description", () => {
    render(<About />);
    expect(screen.getByText(content.about.title)).toBeInTheDocument();
    expect(screen.getByText(content.about.description)).toBeInTheDocument();
  });

  it("renders initial tab content (Information) correctly", () => {
    render(<About />);
    expect(screen.getByText(content.about.basicInfo.title)).toBeInTheDocument(); // Tab label
    expect(screen.getByText(content.about.basicInfo.locationLabel)).toBeInTheDocument();
    expect(screen.getByText(content.about.basicInfo.location)).toBeInTheDocument();
    expect(screen.getByText(content.about.basicInfo.languagesLabel)).toBeInTheDocument();
    expect(screen.getByText(content.about.basicInfo.languages)).toBeInTheDocument();
    expect(screen.getByText(content.about.basicInfo.statusLabel)).toBeInTheDocument();
    expect(screen.getByText(content.about.basicInfo.status)).toBeInTheDocument();
  });

  it("switches tab content when Skills tab is clicked", () => {
    render(<About />);
    fireEvent.click(screen.getByText(content.about.skills.title));
    expect(screen.getByTestId("skills-grid")).toBeInTheDocument();
    expect(screen.queryByText(content.about.basicInfo.location)).not.toBeInTheDocument();
  });

  it("switches tab content when Education tab is clicked", () => {
    render(<About />);
    fireEvent.click(screen.getByText(content.about.education.title));
    expect(screen.getByText(content.about.education.items[0].school)).toBeInTheDocument();
    expect(screen.getByText(content.about.education.items[0].degree)).toBeInTheDocument();
    expect(screen.queryByText(content.about.basicInfo.location)).not.toBeInTheDocument();
  });

  it("switches tab content when Certificates tab is clicked", () => {
    render(<About />);
    fireEvent.click(screen.getByText(content.about.certificates.title));
    // Check for first certificate item
    expect(screen.getByText(content.about.certificates.items[0].items[0].name)).toBeInTheDocument();
    expect(
      screen.getByText(content.about.certificates.items[0].items[0].provider)
    ).toBeInTheDocument();
    expect(screen.queryByText(content.about.basicInfo.location)).not.toBeInTheDocument();
  });
});
