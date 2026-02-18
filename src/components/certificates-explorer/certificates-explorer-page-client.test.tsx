import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { CertificatesExplorerPageClient } from "./certificates-explorer-page-client";
import type { CertificateMarkdownDoc, CertificatesTreeCategory } from "@/lib/certificates-markdown";

const mockReplace = jest.fn();
const mockPush = jest.fn();
let mockParams = new URLSearchParams();

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock("remark-gfm", () => ({
  __esModule: true,
  default: () => undefined,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
  usePathname: () => "/tqdat410/certificates",
  useSearchParams: () => ({
    get: (key: string) => mockParams.get(key),
    toString: () => mockParams.toString(),
  }),
}));

const doc: CertificateMarkdownDoc = {
  title: "Certificates",
  slug: "certificates",
  order: 1,
  fileName: "certificates.md",
  rawMarkdown: "## Overview\n\nCertificates list",
  categories: [
    {
      name: "Coursera",
      items: [
        {
          name: "demo-certificate.pdf",
          title: "Demo Certificate",
          provider: "Coursera",
          url: "https://example.com/demo-certificate",
        },
      ],
    },
    {
      name: "FPT Software",
      items: [],
    },
    {
      name: "FPT University",
      items: [],
    },
  ],
};

const tree: CertificatesTreeCategory[] = [
  {
    name: "Coursera",
    items: [
      {
        name: "demo-certificate.pdf",
        title: "Demo Certificate",
        provider: "Coursera",
        url: "https://example.com/demo-certificate",
      },
    ],
  },
  { name: "FPT Software", items: [] },
  { name: "FPT University", items: [] },
];

describe("CertificatesExplorerPageClient", () => {
  const originalOpen = window.open;
  let openMock: jest.Mock;

  beforeEach(() => {
    mockReplace.mockReset();
    mockPush.mockReset();
    mockParams = new URLSearchParams("view=preview");
    openMock = jest.fn();
    window.open = openMock;
  });

  afterAll(() => {
    window.open = originalOpen;
  });

  it("opens root folder query on single click", () => {
    render(<CertificatesExplorerPageClient doc={doc} tree={tree} />);
    fireEvent.click(screen.getByRole("treeitem", { name: "▾ certificates" }));
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("folder=root%3Acertificates"));
  });

  it("toggles category by arrow click", () => {
    render(<CertificatesExplorerPageClient doc={doc} tree={tree} />);
    fireEvent.click(screen.getByRole("button", { name: "Expand Coursera" }));
    expect(screen.getByRole("treeitem", { name: "demo-certificate.pdf" })).toBeInTheDocument();
  });

  it("opens markdown file on double click", () => {
    render(<CertificatesExplorerPageClient doc={doc} tree={tree} />);
    fireEvent.doubleClick(screen.getByRole("treeitem", { name: "certificates.md" }));
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("file=certificates.md"));
  });

  it("opens pdf url on double click", () => {
    render(<CertificatesExplorerPageClient doc={doc} tree={tree} />);
    fireEvent.click(screen.getByRole("button", { name: "Expand Coursera" }));
    fireEvent.doubleClick(screen.getByRole("treeitem", { name: "demo-certificate.pdf" }));
    expect(openMock).toHaveBeenCalledWith(
      "https://example.com/demo-certificate",
      "_blank",
      "noopener,noreferrer"
    );
  });
});
