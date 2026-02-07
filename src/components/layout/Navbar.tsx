"use client";

import { useActiveSection } from "@/hooks/useActiveSection";

const NAV_ITEMS = [
  { id: "home", label: "Trần Quốc Đạt", font: "font-luxurious-roman", href: "#home" },
  { id: "about", label: "About Me", font: "font-luxurious-roman", href: "#about" },
  { id: "projects", label: "Projects", font: "font-luxurious-roman", href: "#projects" },
  { id: "contact", label: "Get in Touch", font: "font-luxurious-roman", href: "#contact" },
] as const;

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export function Navbar() {
  const activeSection = useActiveSection(SECTION_IDS);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className="fixed bottom-8 left-8 z-50 flex flex-col items-start -space-y-5 pb-[env(safe-area-inset-bottom)]"
      role="navigation"
      aria-label="Main Navigation"
    >
      {NAV_ITEMS.map((item, index) => {
        const isActive = activeSection === item.id;

        return (
          <a
            key={item.id}
            href={item.href}
            onClick={(e) => handleClick(e, item.href)}
            className={`
              block transition-all duration-500 ease-out origin-left
              animate-fade-in-left
              ${item.font} tracking-wide
              ${
                isActive
                  ? "text-lg opacity-100 text-text-primary drop-shadow-[0_0_10px_rgba(203,213,225,0.8)] font-bold"
                  : "text-md opacity-60 text-text-secondary blur-[0.3px] hover:opacity-90 hover:scale-105 hover:text-text-primary"
              }
            `}
            style={{ animationDelay: `${0.3 + index * 0.1}s`, animationFillMode: 'backwards' }}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
