import { content } from "@/content";
import { ReactNode } from "react";

interface ToolbarLinkProps {
  href: string;
  children: ReactNode;
  target?: string;
  rel?: string;
}

function ToolbarLink({ href, children, target, rel }: ToolbarLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className="group relative px-4 py-2 overflow-hidden font-luxurious-roman tracking-wide text-lg"
    >
      {/* Background: Appears from top */}
      <span className="absolute inset-0 bg-text-primary origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100" />

      {/* Text: Contrast color on hover */}
      <span className="relative z-10 text-text-primary transition-colors duration-300 group-hover:text-bg-primary block">
        {children}
      </span>
    </a>
  );
}

export function TopToolbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-4 pointer-events-none">
      <div className="pointer-events-auto animate-fade-in-down" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
        <a
          href={`mailto:${content.contact.email}`}
          className="group relative text-text-primary font-luxurious-roman tracking-wide text-lg"
        >
          {content.contact.email.toLowerCase()}
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-text-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </a>
      </div>
      <div className="flex gap-4 pointer-events-auto animate-fade-in-down" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
        <ToolbarLink href={content.hero.resumeUrl} target="_blank" rel="noopener noreferrer">
          download cv
        </ToolbarLink>
        <ToolbarLink href="/projects">projects</ToolbarLink>
        <ToolbarLink href={content.social.github} target="_blank" rel="noopener noreferrer">
          github
        </ToolbarLink>
      </div>
    </header>
  );
}
