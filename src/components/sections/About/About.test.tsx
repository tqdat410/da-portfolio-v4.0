import { act, fireEvent, render, screen } from "@testing-library/react";
import { About } from "./About";
import "@testing-library/jest-dom";
import { content } from "@/content";

const expectedCourseraTotal = content.about.certificates.items
  .filter((group) => group.name.toLowerCase() === "coursera")
  .reduce((total, group) => total + (group.count ?? group.items.length), 0);

let resizeObserverCallback: ResizeObserverCallback | null = null;
let animationFrameId = 0;
let animationFrameTime = 0;
let queuedAnimationFrames = new Map<number, FrameRequestCallback>();

class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    resizeObserverCallback = callback;
  }

  observe() {}
  unobserve() {}
  disconnect() {}
}

function createMatchMediaResult(matches: boolean, query: string): MediaQueryList {
  return {
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
}

function setTerminalMetrics(
  element: HTMLElement,
  { clientHeight, scrollHeight, scrollTop = 0 }: { clientHeight: number; scrollHeight: number; scrollTop?: number }
) {
  let currentScrollHeight = scrollHeight;
  let currentScrollTop = scrollTop;

  Object.defineProperty(element, "clientHeight", {
    configurable: true,
    value: clientHeight,
  });
  Object.defineProperty(element, "scrollHeight", {
    configurable: true,
    get: () => currentScrollHeight,
  });
  Object.defineProperty(element, "scrollTop", {
    configurable: true,
    get: () => currentScrollTop,
    set: (value: number) => {
      currentScrollTop = value;
    },
  });

  return {
    getScrollTop: () => currentScrollTop,
    setScrollHeight: (value: number) => {
      currentScrollHeight = value;
    },
    setScrollTop: (value: number) => {
      currentScrollTop = value;
    },
  };
}

function triggerTerminalResize() {
  if (!resizeObserverCallback) {
    throw new Error("ResizeObserver callback not registered");
  }

  act(() => {
    resizeObserverCallback?.([] as ResizeObserverEntry[], {} as ResizeObserver);
  });
}

function runNextAnimationFrame(stepMs = 120) {
  const callbacks = Array.from(queuedAnimationFrames.values());
  queuedAnimationFrames.clear();
  animationFrameTime += stepMs;

  act(() => {
    callbacks.forEach((callback) => callback(animationFrameTime));
  });
}

function runAllAnimationFrames(stepMs = 120, maxFrames = 10) {
  let framesRemaining = maxFrames;
  while (queuedAnimationFrames.size > 0 && framesRemaining > 0) {
    runNextAnimationFrame(stepMs);
    framesRemaining -= 1;
  }
}

describe("About Section", () => {
  beforeEach(() => {
    resizeObserverCallback = null;
    animationFrameId = 0;
    animationFrameTime = 0;
    queuedAnimationFrames = new Map<number, FrameRequestCallback>();

    global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback: FrameRequestCallback) => {
      animationFrameId += 1;
      queuedAnimationFrames.set(animationFrameId, callback);
      return animationFrameId;
    });
    jest.spyOn(window, "cancelAnimationFrame").mockImplementation((id: number) => {
      queuedAnimationFrames.delete(id);
    });

    const matchMediaMock = window.matchMedia as jest.Mock;
    matchMediaMock.mockImplementation((query: string) => createMatchMediaResult(false, query));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders improved intro with required highlighted keywords", () => {
    render(<About />);
    expect(screen.getByText("Tran Quoc Dat")).toBeInTheDocument();
    expect(screen.getByText("FPT University")).toBeInTheDocument();
    expect(screen.getByText("Ho Chi Minh City")).toBeInTheDocument();
    expect(screen.getByText("AI Tools")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.queryByText("SAP Technical Consultant")).not.toBeInTheDocument();
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
    expect(
      screen.getByText(new RegExp(`${expectedCourseraTotal}\\+\\s*Coursera\\s*Certificates`, "i"))
    ).toBeInTheDocument();
    expect(screen.getByText(/FPT Software/i)).toBeInTheDocument();
    expect(screen.getByText(/Certificate on the Job Training/i)).toBeInTheDocument();
    const certificatesLink = screen.getByRole("link", {
      name: /\/tqdat410\/certificates\?file=certificates\.md&view=preview$/,
    });
    expect(certificatesLink).toHaveAttribute(
      "href",
      expect.stringContaining("/tqdat410/certificates?file=certificates.md&view=preview")
    );
    expect(certificatesLink).toHaveAttribute("target", "_blank");
    expect(screen.getByText("Jan 2025 - Apr 2025")).toBeInTheDocument();
  });

  it("renders refactored skill categories in the expected order", () => {
    render(<About />);
    expect(
      screen.getByText((_, element) => element?.tagName === "P" && /Core:\s*ABAP, Java, SpringBoot/i.test(element.textContent ?? ""))
    ).toBeInTheDocument();
    const aiUsageLine = screen.getByText(
      (_, element) => element?.tagName === "P" && /AI Usage:\s*Claude Code, Codex, Antigravity/i.test(element.textContent ?? "")
    );
    expect(aiUsageLine).toBeInTheDocument();
    expect(
      screen.getByText((_, element) =>
        element?.tagName === "P" &&
        /Others:\s*Fiori, UI5, PostgreSQL, JavaScript, TypeScript, React, Next\.js, MongoDB, Redis, Supabase, Docker, Kafka, Cloudflare, n8n,\s*\.\.\./i.test(
          element.textContent ?? ""
        )
      )
    ).toBeInTheDocument();
  });

  it("does not render old section title", () => {
    render(<About />);
    expect(screen.queryByRole("heading", { name: content.about.title })).not.toBeInTheDocument();
  });

  it("waits for overflow before auto-scrolling the terminal", () => {
    render(<About />);
    const terminalBody = screen.getByTestId("about-terminal-body");
    const terminalMetrics = setTerminalMetrics(terminalBody, {
      clientHeight: 560,
      scrollHeight: 480,
    });

    triggerTerminalResize();

    expect(terminalMetrics.getScrollTop()).toBe(0);
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("smoothly follows terminal output after it overflows", () => {
    render(<About />);
    const terminalBody = screen.getByTestId("about-terminal-body");
    const terminalMetrics = setTerminalMetrics(terminalBody, {
      clientHeight: 560,
      scrollHeight: 520,
    });

    triggerTerminalResize();
    terminalMetrics.setScrollHeight(960);
    triggerTerminalResize();

    expect(terminalMetrics.getScrollTop()).toBe(0);

    runNextAnimationFrame(16);
    expect(terminalMetrics.getScrollTop()).toBe(0);

    runNextAnimationFrame(120);
    expect(terminalMetrics.getScrollTop()).toBeGreaterThan(0);
    expect(terminalMetrics.getScrollTop()).toBeLessThan(400);

    runAllAnimationFrames();
    expect(terminalMetrics.getScrollTop()).toBe(400);
  });

  it("does not force auto-follow after the user scrolls away from the bottom", () => {
    render(<About />);
    const terminalBody = screen.getByTestId("about-terminal-body");
    const terminalMetrics = setTerminalMetrics(terminalBody, {
      clientHeight: 560,
      scrollHeight: 960,
    });

    triggerTerminalResize();
    runAllAnimationFrames();
    expect(terminalMetrics.getScrollTop()).toBe(400);

    terminalMetrics.setScrollTop(120);
    fireEvent.scroll(terminalBody);

    terminalMetrics.setScrollHeight(1240);
    triggerTerminalResize();
    runAllAnimationFrames();

    expect(terminalMetrics.getScrollTop()).toBe(120);
  });

  it("jumps directly to the latest terminal output when reduced motion is enabled", () => {
    const matchMediaMock = window.matchMedia as jest.Mock;
    matchMediaMock.mockImplementation((query: string) =>
      createMatchMediaResult(query === "(prefers-reduced-motion: reduce)", query)
    );

    render(<About />);
    const terminalBody = screen.getByTestId("about-terminal-body");
    const terminalMetrics = setTerminalMetrics(terminalBody, {
      clientHeight: 560,
      scrollHeight: 960,
    });

    triggerTerminalResize();

    expect(terminalMetrics.getScrollTop()).toBe(400);
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });
});
