"use client";

import Link from "next/link";
import { ReactNode } from "react";
import "@/styles/navbar.css";

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  isMobile?: boolean;
}

export function NavItem({ href, icon, label, isActive, isMobile }: NavItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`
        nav-item
        relative flex items-center justify-center
        transition-all duration-300 ease-out
        group
        ${isMobile ? "flex-1 py-3" : "w-14 h-14 rounded-lg"}
        ${isActive
          ? "active text-aqua-bright"
          : "text-deep-ocean hover:text-teal-accent hover:bg-teal-accent/10"
        }
      `}
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
    >
      <span className={`nav-icon w-6 h-6 transition-all duration-300 ${isActive ? "scale-110" : ""}`}>
        {icon}
      </span>

      {/* Tooltip (desktop only) */}
      {!isMobile && (
        <span
          className={`
            absolute left-full ml-4 px-3 py-1.5
            bg-midnight/95 text-light-aqua text-sm rounded-md
            border border-teal-accent/20
            opacity-0 group-hover:opacity-100
            pointer-events-none whitespace-nowrap
            transition-all duration-200
            ${isActive ? "border-aqua-bright/30" : ""}
          `}
        >
          {label}
        </span>
      )}
    </Link>
  );
}
