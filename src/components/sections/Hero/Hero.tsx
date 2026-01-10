"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/layout/Section";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <Section id="home" className="relative">
      <div className="text-center max-w-3xl mx-auto">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-teal-accent/10 border border-teal-accent/30">
          <span className="w-2 h-2 rounded-full bg-aqua-bright animate-pulse" />
          <span className="text-sm text-aqua-bright">{t("status")}</span>
        </div>

        {/* Greeting */}
        <p className="text-lg md:text-xl text-teal-accent mb-2">
          {t("greeting")}
        </p>

        {/* Name */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-light-aqua mb-4 tracking-tight">
          {t("name")}
        </h1>

        {/* Role */}
        <p className="text-xl md:text-2xl text-aqua-bright mb-6">
          {t("role")}
        </p>

        {/* Description */}
        <p className="text-base md:text-lg text-deep-ocean/80 max-w-xl mx-auto mb-8 leading-relaxed">
          {t("description")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#projects"
            className="
              px-8 py-3 rounded-lg
              bg-teal-accent text-midnight font-medium
              hover:bg-aqua-bright transition-colors
              shadow-lg shadow-teal-accent/20
            "
          >
            {t("cta")}
          </a>
          <a
            href={t("resumeUrl_en")} // Fallback to EN if locale specific logic is needed, handled by component logic or data
            target="_blank"
            rel="noopener noreferrer"
            className="
              px-8 py-3 rounded-lg
              border border-teal-accent/50 text-aqua-bright
              hover:bg-teal-accent/10 transition-colors
            "
          >
            {t("downloadCv")}
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-teal-accent/50 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-aqua-bright animate-pulse" />
        </div>
      </div>
    </Section>
  );
}
