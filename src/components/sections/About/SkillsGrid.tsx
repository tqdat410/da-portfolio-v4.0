"use client";

import { content } from "@/content";

export function SkillsGrid() {
  const categories = content.about.skills.categories;

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
          <h4 className="text-lg font-semibold text-aqua-bright mb-4">{category.title}</h4>
          <div className="flex flex-wrap gap-2">
            {category.items.map((skill: string) => (
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
