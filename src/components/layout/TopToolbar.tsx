"use client";

import { content } from "@/content";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { ReactNode } from "react";

interface ToolbarLinkProps {
  href: string;
  children: ReactNode;
  target?: string;
  rel?: string;
  inverted?: boolean;
}

function ToolbarLink({ href, children, target, rel, inverted = false }: ToolbarLinkProps) {
  const hoverBgClass = inverted ? "bg-[#0c0c0c]" : "bg-[#fafafa]";
  const textClass = inverted ? "text-[#0c0c0c]" : "text-[#fafafa]";
  const hoverTextClass = inverted ? "group-hover:text-[#fafafa]" : "group-hover:text-[#0c0c0c]";

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className="group relative shrink-0 overflow-hidden px-1.5 py-2 font-luxurious-roman text-xs tracking-wide whitespace-nowrap md:px-4 md:text-lg"
    >
      {/* Background: Appears from top */}
      <span className={`absolute inset-0 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100 ${hoverBgClass}`} />

      {/* Text: Contrast color on hover */}
      <span className={`relative z-10 block transition-colors duration-300 ${textClass} ${hoverTextClass}`}>
        {children}
      </span>
    </a>
  );
}

export function TopToolbar() {
  const isMobile = useIsMobile();
  const activeSection = useActiveSection(["home", "about", "projects", "contact", "footer"]);
  const showSolidBackground = activeSection === "about" || activeSection === "projects";
  const isLightTheme = !isMobile && showSolidBackground;

  const headerClass = isMobile
    ? "bg-[#0c0c0c] pointer-events-auto"
    : showSolidBackground
      ? "bg-[#fafafa] pointer-events-auto"
      : "bg-transparent pointer-events-auto";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex w-full max-w-full items-center justify-end overflow-x-clip px-1 py-2 transition-all duration-300 md:justify-between md:px-4 md:py-4 ${headerClass}`}
    >
      {/* Email - hidden on mobile */}
      <div className="hidden md:block pointer-events-auto animate-fade-in-down" style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}>
        <a
          href="/tqdat410"
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative font-luxurious-roman text-lg tracking-wide ${
            isLightTheme ? "text-[#0c0c0c]" : "text-[#fafafa]"
          }`}
        >
          {content.contact.email.toLowerCase()}
          <span
            className={`absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
              isLightTheme ? "bg-[#0c0c0c]" : "bg-[#fafafa]"
            }`}
          />
        </a>
      </div>
      <div className="flex min-w-0 flex-wrap justify-end gap-0.5 pointer-events-auto animate-fade-in-down md:ml-auto md:gap-4" style={{ animationDelay: '0.8s', animationFillMode: 'backwards' }}>
        <ToolbarLink href={content.hero.resumeUrl} target="_blank" rel="noopener noreferrer" inverted={isLightTheme}>
          download cv
        </ToolbarLink>
        <ToolbarLink href="/tqdat410/projects" inverted={isLightTheme}>
          projects
        </ToolbarLink>
        <ToolbarLink href={content.social.github} target="_blank" rel="noopener noreferrer" inverted={isLightTheme}>
          github
        </ToolbarLink>
      </div>
    </header>
  );
}
