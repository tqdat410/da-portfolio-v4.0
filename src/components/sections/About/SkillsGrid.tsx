"use client";

import { useTranslations } from "next-intl";

interface SkillCategory {
  title: string;
  items: string[];
}

export function SkillsGrid() {
  const t = useTranslations("About");
  const categories = t.raw("skills.categories") as Record<string, SkillCategory>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="skills-grid">
      {Object.entries(categories).map(([key, category]) => (
        <div
          key={key}
          className="
            p-6 rounded-xl
            bg-midnight/50 border border-teal-accent/20
            hover:border-teal-accent/40 transition-colors
          "
        >
          <h4 className="text-lg font-semibold text-aqua-bright mb-4">
            {category.title}
          </h4>
          <div className="flex flex-wrap gap-2">
            {category.items.map((skill) => (
              <span
                key={skill}
                className="
                  px-3 py-1 text-sm rounded-full
                  bg-teal-accent/10 text-light-aqua
                  border border-teal-accent/20
                "
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
