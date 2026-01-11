import { render, screen } from "@testing-library/react";
import { Contact } from "./Contact";
import "@testing-library/jest-dom";
import { content } from "@/content";

describe("Contact Section", () => {
  it("renders the Contact section title and description", () => {
    render(<Contact />);
    expect(screen.getByText(content.contact.title)).toBeInTheDocument();
    expect(screen.getByText(content.contact.description)).toBeInTheDocument();
  });

  it("renders contact information (email and phone)", () => {
    render(<Contact />);
    expect(screen.getByText(content.contact.emailLabel)).toBeInTheDocument();
    expect(screen.getByText(content.contact.email)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: content.contact.email })).toHaveAttribute(
      "href",
      `mailto:${content.contact.email}`
    );

    expect(screen.getByText(content.contact.phoneLabel)).toBeInTheDocument();
    expect(screen.getByText(content.contact.phone)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: content.contact.phone })).toHaveAttribute(
      "href",
      `tel:${content.contact.phone}`
    );
  });

  it("renders social links with correct attributes", () => {
    render(<Contact />);
    expect(screen.getByText(content.contact.cta)).toBeInTheDocument();

    const githubLink = screen.getByLabelText("github");
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", content.social.github);

    const linkedinLink = screen.getByLabelText("linkedin");
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute("href", content.social.linkedin);

    const gmailLink = screen.getByLabelText("gmail");
    expect(gmailLink).toBeInTheDocument();
    expect(gmailLink).toHaveAttribute("href", content.social.gmail);
  });
});
