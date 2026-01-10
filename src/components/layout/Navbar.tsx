"use client";

import { useTranslations } from "next-intl";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useActiveSection } from "@/hooks/useActiveSection";
import { NavItem } from "./NavItem";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { HomeIcon, UserIcon, FolderIcon, MailIcon } from "@/components/icons/index";

const NAV_ITEMS = [
  { id: "home", icon: HomeIcon, href: "#home" },
  { id: "about", icon: UserIcon, href: "#about" },
  { id: "projects", icon: FolderIcon, href: "#projects" },
  { id: "contact", icon: MailIcon, href: "#contact" },
] as const;

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export function Navbar() {
  const t = useTranslations("Navigation");
  const isMobile = useIsMobile();
  const activeSection = useActiveSection(SECTION_IDS);

  if (isMobile) {
    return (
      <nav
        className="
          fixed bottom-0 left-0 right-0 z-50
          h-16 bg-midnight/95 backdrop-blur-md
          border-t border-teal-accent/20
          flex items-center justify-around
          safe-area-pb
        "
        role="navigation"
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            href={item.href}
            icon={<item.icon className="w-6 h-6" />}
            label={t(item.id)}
            isActive={activeSection === item.id}
            isMobile
          />
        ))}
      </nav>
    );
  }

  return (
    <nav
      className="
        fixed left-0 top-0 z-50
        h-screen w-20
        bg-midnight/80 backdrop-blur-md
        border-r border-teal-accent/10
        flex flex-col items-center
        py-6
      "
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="mb-8">
        <div
          className={`
            w-10 h-10 rounded-full
            flex items-center justify-center
            transition-all duration-500
            ${activeSection === "home"
              ? "bg-teal-accent/30 shadow-lg shadow-teal-accent/20"
              : "bg-teal-accent/10"
            }
          `}
        >
          <span className="text-aqua-bright font-bold text-lg">D</span>
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex-1 flex flex-col items-center gap-2">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            href={item.href}
            icon={<item.icon className="w-6 h-6" />}
            label={t(item.id)}
            isActive={activeSection === item.id}
          />
        ))}
      </div>

      {/* Language switcher */}
      <LanguageSwitcher />
    </nav>
  );
}
