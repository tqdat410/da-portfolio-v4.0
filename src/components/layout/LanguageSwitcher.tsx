"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

/**
 * Language toggle button for Navbar.
 * Switches between EN/VN locales.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "vn" : "en";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLocale}
      className="
        mt-auto mb-6 px-3 py-1.5 rounded-lg
        text-sm font-medium tracking-wide
        text-deep-ocean hover:text-aqua-bright
        bg-teal-accent/5 hover:bg-teal-accent/20
        border border-teal-accent/20 hover:border-teal-accent/40
        transition-all duration-300
        focus-visible:ring-2 focus-visible:ring-aqua-bright
        focus:outline-none
      "
      aria-label={`${t("switchLanguage")} ${locale === "en" ? "VN" : "EN"}`}
    >
      {locale === "en" ? "VN" : "EN"}
    </button>
  );
}
