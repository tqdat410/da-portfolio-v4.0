"use client";

import { content } from "@/content";
import { ReactNode, useState, useEffect } from "react";

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
      className="group relative px-1.5 py-2 md:px-4 overflow-hidden font-luxurious-roman tracking-wide text-xs md:text-lg whitespace-nowrap"
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center md:justify-between items-center px-1 py-2 md:px-4 md:py-4 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm pointer-events-auto"
          : "pointer-events-none"
      }`}
    >
      {/* Email - hidden on mobile */}
      <div className="hidden md:block pointer-events-auto animate-fade-in-down" style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}>
        <a
          href={`mailto:${content.contact.email}`}
          className="group relative text-text-primary font-luxurious-roman tracking-wide text-lg"
        >
          {content.contact.email.toLowerCase()}
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-text-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </a>
      </div>
      <div className="flex gap-0 md:gap-4 pointer-events-auto animate-fade-in-down md:ml-auto" style={{ animationDelay: '0.8s', animationFillMode: 'backwards' }}>
        <ToolbarLink href={content.hero.resumeUrl} target="_blank" rel="noopener noreferrer">
          <span className="md:hidden">cv</span>
          <span className="hidden md:inline">download cv</span>
        </ToolbarLink>
        <ToolbarLink href="/projects">projects</ToolbarLink>
        <ToolbarLink href="/certificates">
          <span className="md:hidden">certs</span>
          <span className="hidden md:inline">certificates</span>
        </ToolbarLink>
        <ToolbarLink href={content.social.github} target="_blank" rel="noopener noreferrer">
          github
        </ToolbarLink>
      </div>
    </header>
  );
}
